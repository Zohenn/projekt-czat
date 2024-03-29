<template>
  <div id='chat-settings-container'>
    <div class='chat-setting'>
      <div style='max-width: 560px;'>
        <div class='chat-setting-name'>Pseudonimy</div>
        <ChatSettingNickname v-for='uid in chat.users' class='chat-setting-wrapper' :key='uid' :uid='uid'
                             :nickname='chat?.nicknames?.[uid] ?? ""'
                             @setNickname='setNickname(uid, $event)'/>
      </div>
    </div>
    <div class='chat-setting'>
      <div style='max-width: 560px;'>
        <div class='chat-setting-name'>Kolor czatu</div>
        <ChatSettingColor :color='chat.color ?? "#009999"' @setColor='setColor($event)'/>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Chat from "@/entities/chat";
  import ChatSettingNickname from "@/views/chat/chatSettings/ChatSettingNickname.vue";
  import firebase from "firebase";
  import FieldValue = firebase.firestore.FieldValue;
  import ChatSettingColor from "@/views/chat/chatSettings/ChatSettingColor.vue";

  export default defineComponent({
    name: "ChatSettingsView",
    components: { ChatSettingColor, ChatSettingNickname },
    props: {
      chat: {
        required: true,
        type: Chat,
      }
    },

    computed: {
      uid(): string {
        return this.$store.getters['auth/uid'];
      }
    },

    methods: {
      async setNickname(uid: string, newNickname: string | null) {
        const nickname = this.chat.nicknames?.[uid] ?? '';
        if (nickname !== newNickname) {
          const getUserByUid = this.$store.getters['users/getUserByUid'];
          let text: string;
          if (newNickname === '') {
            newNickname = null;
            text = this.uid === uid ? `${getUserByUid(this.uid).displayName} usunął swój pseudonim` :
                `${getUserByUid(this.uid).displayName} usunął pseudonim ${getUserByUid(uid).displayName}`;
          } else {
            text = this.uid === uid ?
                `${getUserByUid(this.uid).displayName} zmienił swój pseudonim na ${newNickname}` :
                `${getUserByUid(this.uid).displayName} zmienił pseudonim ${getUserByUid(uid).displayName} na ${newNickname}`;
          }

          const batch = this.chat.docReference.firestore.batch();
          batch.set(this.chat.docReference, {
            nicknames: {
              [uid]: newNickname
            }
          }, { merge: true });
          batch.set(this.chat.docReference.collection('messages').doc(), {
            author: 'system',
            date: FieldValue.serverTimestamp(),
            text,
          });
          await batch.commit();
        }
      },

      async setColor(color: string) {
        if (color === this.chat.color) {
          return;
        }

        const batch = this.chat.docReference.firestore.batch();
        batch.update(this.chat.docReference, { color });
        batch.set(this.chat.docReference.collection('messages').doc(), {
          author: 'system',
          date: FieldValue.serverTimestamp(),
          text: `${this.$store.state.auth.user.displayName} zmienił kolor czatu`,
        });
        await batch.commit();
      }
    }
  })
</script>

<style lang='scss'>
  #chat-settings-container {
    padding: 1rem;
  }

  .chat-setting {
    margin-top: 1rem;
    border-bottom: 1px solid var(--grey);

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  .chat-setting-name {
    font-size: 1.2em;
    font-weight: 500;
    margin-bottom: .75rem;
    margin-left: .5rem;
    color: var(--grey-text);
  }

  .chat-setting-wrapper {
    position: relative;
    padding: .5rem;
    border-radius: 4px;
    cursor: pointer;

    .edit-icon {
      position: absolute;
      display: none;
      color: var(--primary-color);
      top: 50%;
      right: .5rem;
      transform: translateY(-50%);
    }

    &.active {
      cursor: initial;
      background-color: transparent !important;

      .edit-icon {
        display: none !important;
      }
    }

    &:hover {
      background-color: var(--grey-light);

      .edit-icon {
        display: inline-block;
      }
    }
  }
</style>
