<template>
  <PromiseHandler :promise='loadPromise' class='centered-flex'>
    <div id='chat-container'>
      <div id='chat-header'>
        <div id='user-info'>
          <img src='../../assets/avatar.png' alt='Avatar'/>
          <div class='text-overflow'>
            <span>{{ chat.getNicknameFor(otherUser) }}</span>
          </div>
        </div>
        <div id='chat-tabs'>
          <router-link v-for='tab in tabs' :key='tab.routeName' :to='{ name: tab.routeName }' class='tab'>
            <MdIcon>{{ tab.icon }}</MdIcon>
          </router-link>
        </div>
        <div id='chat-tab-btn'>
          <button class='tab' @click.stop='tabMenuOpen = !tabMenuOpen'>
            <MdIcon>{{ activeTab.icon }}</MdIcon>
          </button>
          <div v-if='tabMenuOpen' id='chat-tab-menu'>
            <router-link v-for='tab in inactiveTabs' :key='"btn-" + tab.routeName' :to='{ name: tab.routeName }'
                         class='chat-tab-menu-btn'>
              <MdIcon>{{ tab.icon }}</MdIcon>
            </router-link>
          </div>
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

  interface Tab {
    routeName: string;
    icon: string;
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
        tabs: [
          {
            routeName: 'chat-messages',
            icon: 'chat_bubble',
          },
          {
            routeName: 'chat-images',
            icon: 'image',
          },
          {
            routeName: 'chat-settings',
            icon: 'settings',
          }
        ] as Tab[],
        tabMenuOpen: false,
      }
    },

    created() {
      this.loadPromise.then(() => {
        this.setColor();
      });

      document.body.addEventListener('click', this.closeTabMenu);
    },

    beforeUnmount() {
      const root = document.documentElement;
      root.style.setProperty('--primary', root.style.getPropertyValue('--original-primary'))
      document.body.removeEventListener('click', this.closeTabMenu);
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

      activeTab(): Tab {
        return this.tabs.find(tab => tab.routeName === this.$route.name) as Tab;
      },

      inactiveTabs(): Tab[] {
        return this.tabs.filter((tab => tab.routeName !== this.$route.name));
      }
    },

    methods: {
      closeTabMenu() {
        this.tabMenuOpen = false;
      },

      setColor() {
        const { color } = this.chat;
        if(!color){
          return;
        }

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
      overflow: hidden;

      img {
        height: 30px;
        margin-right: 1rem;
        border-radius: 50%;
      }
    }
  }

  @media only screen and (max-width: 359px) {
    #chat-tabs {
      display: none !important;
    }

    #chat-tab-btn {
      display: flex !important;
    }
  }

  #chat-tabs, #chat-tab-btn {
    display: flex;
    padding: 0 1rem;
    align-self: stretch;
    margin-bottom: -1px;
  }

  #chat-tab-btn {
    display: none;
    position: relative;

    & .tab {
      color: var(--primary-color);
    }

    & #chat-tab-menu {
      display: flex;
      position: absolute;
      background-color: var(--grey-bg);
      border: 1px solid var(--grey);
      border-radius: 8px;
      top: calc(100% - 1px);
      overflow: hidden;
      box-shadow: 0 2px 6px 1px var(--grey-text);
      z-index: 2000;

      .chat-tab-menu-btn {
        display: flex;
        align-items: center;
        padding: .5rem;
        color: var(--grey-darker);
        text-decoration: none;
        transition: background-color .2s, color .2s;

        &:hover, &:focus {
          color: var(--primary-color-fade);
          background-color: var(--primary-color-fade-strong);
          outline: 0;
        }

        &:first-child {
          border-right: 1px solid var(--grey);
        }
      }
    }
  }

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
</style>
