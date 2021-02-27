<template>
  <div class='user-search-container' @click.stop='showResults = searchText !== ""'>
    <div class='user-search-wrapper' :class='{ "results-visible": resultsVisible }'>
      <label for='user-search' class='d-none'>Imię, nazwisko</label>
      <input id='user-search' type='text' placeholder='Imię, nazwisko' v-debounce='search'>
      <span class='material-icons search-icon'>search</span>
    </div>
    <ul v-if='resultsVisible' class='search-results'>
      <template v-if='loading'>
        <li style='text-align: center;'><span class='spinner-narrow'></span></li>
      </template>
      <template v-else>
        <li v-for='result in results' :key='result.id' @click='openChat(result)'>
          {{ result.displayName }}
        </li>
        <li v-if='results.length === 0' style='text-align: center;'>Brak wyników</li>
      </template>
    </ul>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import AppUser from "@/entities/appUser";
  import { firestore } from "@/firebase";
  import { getConverter } from "@/entities/firestoreDocument";
  import firebase from "firebase";
  import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

  export default defineComponent({
    name: "UserSearch",
    data() {
      return {
        loading: false,
        results: [] as AppUser[],
        searchText: '',
        showResults: false,
      }
    },

    created() {
      document.body.addEventListener('click', this.closeSearch);
    },

    unmounted() {
      document.body.removeEventListener('click', this.closeSearch);
    },

    computed: {
      resultsVisible(): boolean {
        return (this.showResults || this.loading) && this.searchText != '';
      }
    },

    methods: {
      closeSearch() {
        this.showResults = false;
      },

      openChat(user: AppUser) {
        this.showResults = false;
        this.$router.push(`/chat/${user.id}`);
      },

      async search(val: string) {
        val = val.toLowerCase();
        this.searchText = val;
        if (!val) {
          return;
        }

        this.loading = true;
        const baseQuery = firestore.collection('users').limit(5).withConverter(getConverter(AppUser));
        const querySnapshots = await Promise.all([
          baseQuery
              .where('searchNS', '>=', val)
              .where('searchNS', '<', val + '\uf8ff')
              .get(),
          baseQuery
              .where('searchSN', '>=', val)
              .where('searchSN', '<', val + '\uf8ff')
              .get()
        ]);

        const users: { [key: string]: QueryDocumentSnapshot<AppUser> } = {};

        querySnapshots.forEach(snapshot => snapshot.docs.forEach((e) => users[e.id] = e))

        this.results = Object.values(users).slice(0, 5).map((e) => e.data());
        this.showResults = true;
        this.loading = false;
      }
    }
  })
</script>

<style scoped lang='scss'>
  .user-search-container {
    position: relative;
    flex-grow: 1;
    margin: 0 1rem;
    max-width: 300px;

    .search-results {
      width: 100%;
      position: absolute;
      list-style-type: none;
      margin: 0;
      padding: 0;
      background-color: white;
      border: 1px solid #d0d0d0;
      border-top: 0;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;

      li {
        padding: .5rem .75rem;

        &:hover {
          background-color: #ebebeb;
          cursor: pointer;
        }
      }
    }
  }

  .user-search-wrapper {
    position: relative;
    margin: 0 auto;

    &.results-visible input {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    input {
      display: block;
      width: 100%;
      margin: 0 auto;
      background-color: white;
      padding-left: .75rem;
      padding-right: 36px;
      border-radius: 10px;

      &:focus + .search-icon {
        color: var(--primary-color);
      }
    }

    .search-icon {
      position: absolute;
      top: 50%;
      right: 6px;
      transform: translateY(-50%);
      color: #999999;
    }
  }

  .spinner-narrow {
    font-size: 1rem;
    --circle-width: .2rem;
  }
</style>
