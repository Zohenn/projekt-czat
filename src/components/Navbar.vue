<template>
  <div id='navbar'>
    <div id='navbar-content'>
      <img src='../assets/logo2.png' alt='Logo' id='logo'/>
      <button v-if='isSignedIn' class='icon-btn' @click='signOut'>
        <span class='material-icons'>logout</span>
      </button>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import { createNamespacedHelpers } from "vuex";

  const { mapGetters } = createNamespacedHelpers('auth');

  export default defineComponent({
    name: "Navbar",
    computed: {
      ...mapGetters(['isSignedIn']),
    },
    methods: {
      signOut() {
        this.$store.dispatch('auth/signOut');
      }
    }
  })
</script>

<style lang='scss'>
  #navbar {
    width: 100%;
    background-color: white;
    border-bottom: 1px solid var(--primary-color);
    z-index: 1;
  }

  #navbar-content {
    display: flex;
    width: 100%;
    max-width: 768px;
    padding: .5rem;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
  }

  #logo {
    height: 40px;
    width: 40px;
  }
</style>
