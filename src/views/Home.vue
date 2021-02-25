<template>
  <div id='entry'>
    <div class='d-flex flex-column'>
      <LoginForm/>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import LoginForm from '@/components/LoginForm.vue';

  export default defineComponent({
    name: "Home",
    components: { LoginForm }
  })
</script>

<style scoped lang='scss'>
  #entry {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
