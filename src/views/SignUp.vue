<template>
  <div id='sign-up-container'>
    <form class='d-flex flex-column align-items-center w-100' ref='form' @submit='signUp'>
      <div class='d-flex flex-column w-100' style='max-width: 250px;'>
        <div v-for='(field, key) in fields' :key='"sign-up-" + key' class='form-row'>
          <label :for='key'>{{ field.label }}</label>
          <input :id='key' :type='field.type' v-model.trim='model[key]' required @focus='field.hadInteraction = true' :class='{"had-interaction": field.hadInteraction}'/>
          <span class='error-text'>{{ field.error }}</span>
        </div>
        <button type='submit' style='font-size: 1.15rem;' :disabled='!isValid'>
        <span v-if='loading' class='btn-spinner-wrapper'>
          <span class='spinner-narrow'></span>
        </span>
          <span v-else>Zarejestruj się</span>
        </button>
      </div>
      <div v-if='signUpError' class='form-error'>
        Nieprawidłowy adres email lub hasło
      </div>
    </form>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: "SignUp",
    data() {
      return {
        loading: false,
        signUpError: '',
        fields: {
          name: {
            label: 'Imię',
            type: 'text',
            hadInteraction: false,
            error: 'Pole nie może być puste',
          },
          surname: {
            label: 'Nazwisko',
            type: 'text',
            hadInteraction: false,
            error: 'Pole nie może być puste',
          },
          email: {
            label: 'Adres email',
            type: 'email',
            hadInteraction: false,
            error: 'Nieprawidłowy adres email',
          },
          password: {
            label: 'Hasło',
            type: 'password',
            hadInteraction: false,
            error: 'Pole nie może być puste',
          }
        },
        model: {
          name: '',
          surname: '',
          email: '',
          password: '',
        }
      }
    },
    computed: {
      isValid(): boolean{
        return Object.values(this.model).every(e => e != '') && (this.$refs.form as HTMLFormElement)?.checkValidity();
      }
    },
    methods: {
      signUp() {
        this.model;
      }
    }
  })
</script>

<style scoped lang='scss'>
  #sign-up-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
