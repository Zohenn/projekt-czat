<template>
  <div id='home'>
    <div v-if='isSignedIn'>{{ $store.state.auth.user.displayName }}</div>
    <div v-else>
      <LoginForm/>
      <div id='sign-up-wrapper'>Nie masz konta? <router-link to='/sign-up'>Zarejestruj się</router-link></div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import LoginForm from '@/components/LoginForm.vue';
  import { createNamespacedHelpers } from "vuex";

  const { mapGetters } = createNamespacedHelpers('auth');

  export default defineComponent({
    name: "HomeView",
    components: { LoginForm },
    computed: {
      ...mapGetters(['isSignedIn']),
    }
  })
</script>

<style scoped lang='scss'>
  #home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #sign-up-wrapper {
    padding-top: .75rem;
  }
</style>
