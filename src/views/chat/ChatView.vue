<template>
  <PromiseHandler :promise='loadPromise' class='centered-flex'>
    <div id='chat-container'>
      <div id='chat-header'>
        <div id='user-info'>
          <img src='../../assets/avatar.png' alt='Avatar'/>
          <span>{{ chat.nicknames[uid] ?? otherUser.displayName }}</span>
        </div>
        <div id='chat-tabs'>
          <router-link :to='{ name: "chat-messages" }' tag='button' class='tab'>
            <MdIcon>chat_bubble</MdIcon>
          </router-link>
          <router-link :to='{ name: "chat-images" }' tag='button' class='tab'>
            <MdIcon>image</MdIcon>
          </router-link>
          <router-link :to='{ name: "chat-settings" }' tag='button' class='tab'>
            <MdIcon>settings</MdIcon>
          </router-link>
        </div>
        <button class='icon-btn' style='margin: .25rem 0 .25rem auto;' @click='$router.push("/")'>
          <MdIcon>close</MdIcon>
        </button>
      </div>
      <router-view v-slot='{ Component }'>
        <keep-alive>
          <component :is='Component' :chat='chat'/>
        </keep-alive>
      </router-view>
    </div>
  </PromiseHandler>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import PromiseHandler from "@/components/PromiseHandler.vue";
  import Chat from "@/entities/chat";
  import AppUser from "@/entities/appUser";
  import MdIcon from "@/components/MdIcon.vue";

  function hexToRgb(hex: string): string | null {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  }

  export default defineComponent({
    name: "ChatView",
    components: { MdIcon, PromiseHandler },
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

    created() {
      this.loadPromise.then(() => {
        this.setColor();
      });
    },

    beforeUnmount() {
      const root = document.documentElement;
      root.style.setProperty('--primary', root.style.getPropertyValue('--original-primary'))
    },

    watch: {
      chat() {
        this.setColor();
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

    methods: {
      setColor() {
        const { color } = this.chat;
        const colorAsRgb = hexToRgb(color as string);
        if (colorAsRgb) {
          document.documentElement.style.setProperty('--primary', colorAsRgb);
        }
      }
    }
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
      text-decoration: none;
      transition: background-color .2s, border-bottom-color .2s, color .2s;

      &:hover, &:focus {
        color: var(--primary-color-fade);
        background-color: var(--primary-color-fade-strong);
        outline: 0;
      }

      &.router-link-exact-active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }
    }
  }
</style>
