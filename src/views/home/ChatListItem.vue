<template>
 <div class='last-chat' @click='openChat'>
   <img class='last-chat-avatar' src='../../assets/avatar.png' alt='Avatar'/>
   <div class='last-chat-info'>
      <div class='last-chat-user'>{{ otherUser.displayName }}</div>
      <div class='last-chat-message'>
        <div class='last-chat-message-text'>{{ `${chat.lastMessage.author === uid ? 'Ty: ' : ''}${chat.lastMessage.text}` }}</div>
        <span class='spacer-dot'></span>
        <div class='last-chat-message-time'>{{ formattedTime }}</div>
      </div>
   </div>
 </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Chat from "@/entities/chat";
  import AppUser from "@/entities/appUser";

  export default defineComponent({
    name: "ChatListItem",
    props: {
      chat: {
        required: true,
        type: Chat,
      }
    },

    computed: {
      uid(): string {
        return this.$store.getters['auth/uid'];
      },

      otherUser(): AppUser {
        return this.$store.getters['users/getUserByUid'](this.chat.getOtherUserTo(this.uid));
      },

      formattedTime(): string {
        const date: Date = this.chat.lastMessage?.date as Date;
        const diff: number = Date.now() - date.getTime();
        if(Math.floor(diff / (60 * 60 * 1000)) < 24){
          return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        }

        return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: new Date().getFullYear() !== date.getFullYear() ? 'numeric' : undefined });
      }
    },

    methods: {
      openChat() {
        this.$router.push(`/chat/${this.otherUser.id}`);
      }
    }
  })
</script>

<style scoped lang='scss'>
  .last-chat {
    display: flex;
    padding: .5rem 1rem;
    border-bottom: 1px solid var(--grey);
    cursor: pointer;

    &:hover {
      background-color: var(--grey-light);
    }
  }

  .last-chat-avatar {
    margin-right: 1rem;

    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .last-chat-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .last-chat-user {
      font-size: 1.2rem;
    }

    .last-chat-message {
      display: flex;
      align-items: center;
      color: var(--grey-text);

      .last-chat-message-text {
        margin-right: .5rem;
      }

      .last-chat-message-time {
        margin-left: .5rem;
      }
    }
  }

  .spacer-dot {
    display: inline-block;
    width: .2rem;
    height: .2rem;
    background-color: var(--grey-text);
    border-radius: 50%;
  }
</style>
