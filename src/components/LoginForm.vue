<template>
  <form class='d-flex flex-column' @submit='login'>
    <div class='form-row'>
      <label for='email' class='d-none'>Adres email</label>
      <input id='email' placeholder='Adres email' v-model='email'/>
    </div>
    <div class='form-row'>
      <label for='password' class='d-none'>Hasło</label>
      <input id='password' placeholder='Hasło' v-model='password'/>
    </div>
    <button type='submit'>Zaloguj się</button>
    <!-- todo: validation -->
  </form>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';

  interface LoginFormModel {
    email: string;
    password: string;
  }

  export default defineComponent({
    name: "LoginForm",
    data(): LoginFormModel {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      login(e: Event) {
        e.preventDefault();
        this.$store.dispatch('auth/signIn', { email: this.email, password: this.password });
      }
    }
  })
</script>

<style scoped lang='scss'>

</style>
