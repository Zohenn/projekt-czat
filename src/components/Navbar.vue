<template>
  <div id='navbar'>
    <div id='navbar-content'>
      <img src='../assets/logo2.png' alt='Logo' id='logo'/>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: "Navbar"
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
    width: 768px;
    padding: .5rem;
    margin: 0 auto;
  }

  #logo {
    height: 40px;
    width: 40px;
  }
</style>
