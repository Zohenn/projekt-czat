<template>
  <div id='chat-input-container'>
    <div style='flex-grow: 1; margin-right: 1rem;'>
      <div id='chat-message-input-wrapper'>
        <div id='chat-message-input' contenteditable='true' @input='text = $event.target.innerText.trim()' ref='input' @keypress.enter='onKeyUp'></div>
        <div v-show='text === ""' class='placeholder'>Aa</div>
      </div>
    </div>
    <button class='icon-btn' @click='sendMessage'><span class='material-icons'>send</span></button>
  </div>
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
      onKeyUp(e: KeyboardEvent) {
        if (!e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      },

      async sendMessage() {
        if (this.text == '') {
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
        (this.$refs.input as HTMLElement).innerHTML = '';
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

  #chat-message-input-wrapper {
    position: relative;

    .placeholder {
      position: absolute;
      top: .5rem;
      left: .75rem;
      color: var(--grey-text);
    }
  }

  #chat-message-input {
    width: 100%;
    padding: .5rem .75rem;
    line-height: 1.25em;
    min-height: 2.25em;
    max-height: 6em;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
</style>
