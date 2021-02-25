<template>
  <Navbar/>
  <main>
    <router-view/>
  </main>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Navbar from '@/components/Navbar.vue';

  export default defineComponent({
    name: 'App',
    components: {
      Navbar
    }
  })
</script>

<style lang="scss">
  #app {
    height: 100vh;
    display: flex;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  main {
    width: 768px;
    box-shadow: 0 0 4px 1px var(--primary-color);
    flex-grow: 1;
  }
</style>
