<template>
  <div id='home'>
    <div v-if='isSignedIn'>{{ $store.state.auth.user.displayName }}</div>
    <LoginForm v-else/>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import LoginForm from '@/components/LoginForm.vue';
  import { createNamespacedHelpers } from "vuex";

  const { mapGetters } = createNamespacedHelpers('auth');

  export default defineComponent({
    name: "Home",
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
</style>
