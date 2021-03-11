<template>
  <form class='d-flex flex-column align-items-center w-100' autocomplete='off' @submit.prevent='signIn'>
    <div class='d-flex flex-column w-100' style='max-width: 250px;'>
      <div class='form-row'>
        <label for='email' class='d-none'>Adres email</label>
        <input id='email' placeholder='Adres email' type='text' v-model.trim='model.email'/>
      </div>
      <div class='form-row'>
        <label for='password' class='d-none'>Hasło</label>
        <input id='password' placeholder='Hasło' type='password' v-model.trim='model.password'/>
      </div>
      <button type='submit' style='font-size: 1.15rem;' :disabled='!isValid'>
        <span v-if='loading' class='btn-spinner-wrapper'>
          <span class='spinner-narrow'></span>
        </span>
        <span v-else>Zaloguj się</span>
      </button>
    </div>
    <div v-if='signInError' class='form-error'>
      Nieprawidłowy adres email lub hasło
    </div>
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
        loading: false,
        signInError: false,
        model: {
          email: '',
          password: '',
        } as LoginFormModel
      };
    },
    computed: {
      isValid(): boolean {
        return this.model.email != '' && this.model.password != '';
      }
    },
    methods: {
      async signIn() {
        this.signInError = false;
        this.loading = true;

        try {
          await this.$store.dispatch('auth/signIn', { email: this.model.email, password: this.model.password });
        } catch (e) {
          this.signInError = true;
        } finally {
          this.loading = false;
        }
      }
    }
  })
</script>

<style scoped lang='scss'>
  .spinner-narrow {
    font-size: 1.15rem;
    --circle-width: .2rem;
  }
</style>
