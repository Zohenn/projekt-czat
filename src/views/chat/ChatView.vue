<template>
  <PromiseHandler :promise='loadPromise' class='centered-flex'>
    <div id='chat-container'>
      <div id='chat-header'>
        <div id='user-info'>
          <img src='../../assets/avatar.png'/>
          <span>{{ otherUser.displayName }}</span>
        </div>
        <div id='chat-tabs'>
          <button class='tab active'>
            <span class='material-icons'>chat_bubble</span>
          </button>
          <button class='tab'>
            <span class='material-icons'>image</span>
          </button>
          <button class='tab'>
            <span class='material-icons'>settings</span>
          </button>
        </div>
        <button class='icon-btn' style='margin: .25rem 0 .25rem auto;' @click='$router.push("/")'>
          <span class='material-icons'>close</span>
        </button>
      </div>
      <ChatMessageList :chat='chat' style='flex-grow: 1;'/>
      <ChatMessageForm :chat='chat'/>
    </div>
  </PromiseHandler>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import PromiseHandler from "@/components/PromiseHandler.vue";
  import Chat from "@/entities/chat";
  import AppUser from "@/entities/appUser";
  import ChatMessageForm from "@/views/chat/ChatMessageForm.vue";
  import ChatMessageList from "@/views/chat/ChatMessageList.vue";

  export default defineComponent({
    name: "ChatView",
    components: { ChatMessageList, ChatMessageForm, PromiseHandler },
    props: {
      uid: String,
    },
    data() {
      return {
        loadPromise: (async () => {
          await this.$store.dispatch('chats/fetchChat', this.uid);
          await this.$store.dispatch('users/fetchUser', this.uid);
        })(),
      }
    },

    computed: {
      chat(): Chat {
        return this.$store.getters['chats/getChatByUid'](this.uid);
      },

      otherUser(): AppUser {
        return this.$store.getters['users/getUserByUid'](this.uid);
      },
    },
  })
</script>

<style scoped lang='scss'>
  #chat-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  #chat-header {
    display: flex;
    padding: 0 1rem;
    align-items: center;
    border-bottom: 1px solid var(--grey);

    #user-info {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--grey-text);

      img {
        height: 30px;
        margin-right: 1rem;
        border-radius: 50%;
      }
    }
  }

  #chat-tabs {
    display: flex;
    padding: 0 1rem;
    align-self: stretch;

    .tab {
      display: flex;
      align-items: center;
      padding: 0 .75rem;
      background-color: transparent;
      border-radius: 0;
      color: var(--grey-darker);
      border-bottom: 2px solid transparent;
      box-shadow: none;
      cursor: pointer;
      transition: background-color .2s, border-bottom-color .2s, color .2s;

      &:hover, &:focus {
        color: var(--primary-color-fade);
        background-color: var(--primary-color-fade-strong);
        outline: 0;
      }

      &.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }
    }
  }
</style>
