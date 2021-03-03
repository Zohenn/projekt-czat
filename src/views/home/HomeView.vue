<template>
  <div id='home'>
    <ChatList v-if='isSignedIn'/>
    <div v-else>
      <LoginForm/>
      <div id='sign-up-wrapper'>Nie masz konta? <router-link to='/sign-up'>Zarejestruj się</router-link></div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import LoginForm from '@/views/home/LoginForm.vue';
  import { createNamespacedHelpers } from "vuex";
  import ChatList from "@/views/home/ChatList.vue";

  const { mapGetters } = createNamespacedHelpers('auth');

  export default defineComponent({
    name: "HomeView",
    components: { ChatList, LoginForm },
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
