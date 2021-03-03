<template>
  <Navbar/>
  <main>
    <PromiseHandler :promise='authPromise' class='d-flex w-100 h-100 justify-content-center align-items-center'>
      <router-view/>
    </PromiseHandler>
  </main>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import PromiseHandler from "@/components/PromiseHandler.vue";

  export default defineComponent({
    name: 'App',
    components: {
      PromiseHandler,
      Navbar
    },
    data() {
      return {
        authPromise: this.$store.dispatch('auth/checkAuthState').then(() => {
          if(!this.$store.getters['auth/isSignedIn']){
            this.$router.replace('/');
          }
        }),
        // authPromise: new Promise((resolve) => {
        //   setTimeout(() => resolve(), 5000000);
        // })
      }
    },
  })
</script>

<style lang="scss">
  #app {
    height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  main {
    width: 100%;
    max-width: 768px;
    box-shadow: 0 0 4px 1px var(--primary-color);
    flex-grow: 1;
    min-height: 0;
  }
</style>
