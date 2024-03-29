<template>
  <div class='chat-message' :class='{ "is-author": isAuthor, "has-read-icon": showReadIcon, "pending": pending }'>
    <div class='chat-message-wrapper'>
      <div v-if='shouldShowTime' class='chat-message-time'>{{ formattedTime }}</div>
      <div class='chat-message-text' :class='{ "has-images": message.images.length > 0 }' @click='showTime = !showTime'>
        <span>{{ message.text }}</span>
      </div>
      <div v-if='message.images.length > 0' class='chat-message-images'>
        <ChatImage v-for='image in message.images' :key='image' :src='$store.state.images.urls[`${chat.imagesPath}/${image}`]' alt='Zdjęcie do wiadomości'/>
      </div>
    </div>
    <MdIcon v-if='showReadIcon' class='read-icon'>visibility</MdIcon>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Message from "@/entities/message";
  import Chat from "@/entities/chat";
  import MdIcon from "@/components/MdIcon.vue";
  import ChatImage from "@/views/chat/ChatImage.vue";

  export default defineComponent({
    name: "ChatMessage",
    components: { ChatImage, MdIcon },
    props: {
      chat: {
        required: true,
        type: Chat,
      },
      forceShowTime: Boolean,
      message: {
        required: true,
        type: Message,
      },
      showReadIcon: Boolean,
      pending: Boolean,
    },
    data() {
      return {
        showTime: false,
      }
    },

    computed: {
      formattedTime(): string {
        return this.message.date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      },

      isAuthor(): boolean {
        return this.message.author == this.$store.getters['auth/uid'];
      },

      shouldShowTime(): boolean {
        return this.forceShowTime || this.showTime;
      }
    },
  })
</script>

<style lang='scss'>
  .chat-message {
    max-width: 60%;
    display: flex;
    align-items: flex-end;
    margin-top: .15rem;
    margin-left: .5rem;
    margin-right: auto;

    .chat-message-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .chat-message-time {
      margin-left: .35rem;
      padding-top: 1rem;
      color: var(--grey-text);
    }

    .chat-message-text {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: .5rem .75rem;
      background-color: var(--grey-light);
      border-radius: 8px;
      white-space: pre-wrap;

      &.has-images {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        padding-bottom: .25rem;
      }
    }

    &.is-author {
      margin-left: auto;
      margin-right: 1.5rem;

      .chat-message-wrapper {
        align-items: flex-end;
      }

      .chat-message-time {
        margin-left: 0;
        margin-right: .35rem;
        text-align: right;
      }

      .chat-message-text {
        background-color: var(--primary-color);
        color: white;
      }

      .chat-message-images {
        border-radius: 8px 0 8px 8px
      }
    }

    &.has-read-icon {
      margin-right: 0;
    }

    .read-icon {
      font-size: 1rem;
      padding: 0 .25rem;
      color: var(--grey-text);
    }

    &.pending {
      opacity: .5;
    }

    .chat-message-images {
      display: flex;
      margin-bottom: .5rem;
      border-radius: 0 8px 8px 8px;
      box-shadow: 0 1px 2px 1px var(--grey);
      overflow: hidden;

      img {
        max-width: 50%;
        object-fit: cover;

        &:only-child {
          max-width: 100%;
        }
      }
    }
  }
</style>
