<template>
  <form class='d-flex flex-column' @submit='login'>
    <div class='form-row'>
      <label for='email' class='d-none'>Adres email</label>
      <input id='email' placeholder='Adres email' v-model='model.email'/>
    </div>
    <div class='form-row'>
      <label for='password' class='d-none'>Hasło</label>
      <input id='password' placeholder='Hasło' v-model='model.password'/>
    </div>
    <button type='submit' style='font-size: 1.1rem;'>
      <span v-if='loading' class='spinner-narrow' style='--spinner-color: white; font-size: 1.1rem; --circle-width: .2rem'></span>
      <span v-else>Zaloguj się</span>
    </button>
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
    data() {
      return {
        loading: true,
        model: {
          email: '',
          password: '',
        } as LoginFormModel
      };
    },
    methods: {
      login(e: Event) {
        e.preventDefault();
        this.loading = !this.loading;
        return;
        // eslint-disable-next-line no-unreachable
        this.loading = true;
        this.$store.dispatch('auth/signIn', { email: this.model.email, password: this.model.password }).finally(() => this.loading = false);
      }
    }
  })
</script>

<style scoped lang='scss'>

</style>
