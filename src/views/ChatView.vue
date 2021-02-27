<template>
  <PromiseHandler :promise='loadPromise' class='centered-flex'>
    <div id='chat-container'>
      <div id='chat-header'>
        <div id='user-display-name'>{{ otherUser.displayName }}</div>
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
      <div style='flex-grow: 1;'>
      </div>
      <form @submit.prevent>
        <div id='chat-input-container'>
          <div style='flex-grow: 1; margin-right: 1rem;'>
            <label for='chat-message'>
              <input id='chat-message' type='text' placeholder='Aa'>
            </label>
          </div>
          <button type='submit' class='icon-btn'><span class='material-icons'>send</span></button>
        </div>
      </form>
    </div>
  </PromiseHandler>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import PromiseHandler from "@/components/PromiseHandler.vue";
  import Chat from "@/entities/chat";
  import AppUser from "@/entities/appUser";

  export default defineComponent({
    name: "ChatView",
    components: { PromiseHandler },
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

    #user-display-name {
      font-size: 1.2rem;
      font-weight: 500;
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
      color: var(--grey);
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

  #chat-input-container {
    display: flex;
    align-items: center;
    padding: .5rem 1rem;
    border-top: 1px solid var(--grey);
  }

  #chat-message {
    width: 100%;
    padding: .5rem .75rem;
  }
</style>
