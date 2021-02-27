<template>
  <form @submit.prevent='sendMessage' autocomplete='off'>
    <div id='chat-input-container'>
      <div style='flex-grow: 1; margin-right: 1rem;'>
        <label for='chat-message-input'>
          <input id='chat-message-input' type='text' placeholder='Aa' v-model.trim='text'>
        </label>
      </div>
      <button type='submit' class='icon-btn'><span class='material-icons'>send</span></button>
    </div>
  </form>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Chat from "@/entities/chat";
  import firebase from "firebase";
  import FieldValue = firebase.firestore.FieldValue;

  export default defineComponent({
    name: "ChatMessageForm",
    props: {
      chat: {
        required: true,
        type: Chat,
      },
    },
    data() {
      return {
        text: '',
      }
    },

    methods: {
      async sendMessage(){
        if(this.text == ''){
          return;
        }

        const batch = this.chat.docReference.firestore.batch();
        const message = {
          author: this.$store.getters['auth/uid'],
          date: FieldValue.serverTimestamp(),
          text: this.text,
        };

        batch.set(this.chat.docReference.collection('messages').doc(), message);
        batch.update(this.chat.docReference, {
          lastMessage: message,
        });

        this.text = '';
        await batch.commit();
      }
    }
  })
</script>

<style scoped lang='scss'>
  #chat-input-container {
    display: flex;
    align-items: center;
    padding: .5rem 1rem;
    border-top: 1px solid var(--grey);
  }

  #chat-message-input {
    width: 100%;
    padding: .5rem .75rem;
  }
</style>
