<template>
  <div id='sign-up-container'>
    <form class='d-flex flex-column align-items-center w-100' ref='form' @submit.prevent='signUp'>
      <div class='d-flex flex-column w-100' style='max-width: 250px;'>
        <div v-for='(field, key) in fields' :key='"sign-up-" + key' class='form-row'>
          <label :for='key'>{{ field.label }}</label>
          <input :id='key' :type='field.type' v-model.trim='model[key]' required @focusout='field.hadInteraction = true'
                 :minlength='field.minlength'
                 :class='{"had-interaction": field.hadInteraction}'/>
          <span class='error-text'>{{ field.errorText }}</span>
        </div>
        <button type='submit' style='font-size: 1.15rem;' :disabled='!isValid'>
          <span v-if='loading' class='btn-spinner-wrapper'>
            <span class='spinner-narrow'></span>
          </span>
          <span v-else>Zarejestruj się</span>
        </button>
      </div>
      <div v-if='signUpError' class='form-error'>{{ signUpError }}</div>
    </form>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: "SignUpView",
    data() {
      return {
        loading: false,
        signUpError: '',
        fields: {
          name: {
            label: 'Imię',
            type: 'text',
            hadInteraction: false,
            errorText: 'Pole nie może być puste',
          },
          surname: {
            label: 'Nazwisko',
            type: 'text',
            hadInteraction: false,
            errorText: 'Pole nie może być puste',
          },
          email: {
            label: 'Adres email',
            type: 'email',
            hadInteraction: false,
            errorText: 'Nieprawidłowy adres email',
          },
          password: {
            label: 'Hasło',
            type: 'password',
            hadInteraction: false,
            errorText: 'Hasło musi mieć długość co najmniej 6 znaków',
            minlength: 6,
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
      isValid(): boolean {
        return Object.values(this.model).every(e => e != '') && (this.$refs.form as HTMLFormElement)?.checkValidity();
      }
    },
    methods: {
      async signUp() {
        this.signUpError = '';
        this.loading = true;

        try {
          await this.$store.dispatch('auth/signUp', this.model);
          await this.$router.push('/');
        } catch (e) {
          if (e.code == 'auth/email-already-in-use') {
            this.signUpError = 'Istnieje konto z podanym adresem email';
          } else {
            this.signUpError = 'Błąd rejestracji';
          }
        } finally {
          this.loading = false;
        }
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

  .spinner-narrow {
    font-size: 1.15rem;
    --circle-width: .2rem;
  }
</style>
