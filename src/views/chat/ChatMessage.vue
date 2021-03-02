<template>
  <div class='chat-message' :class='{ "is-author": isAuthor, "has-read-icon": showReadIcon, "pending": pending }'>
    <div class='chat-message-wrapper'>
      <div v-if='shouldShowTime' class='chat-message-time'>{{ formattedTime }}</div>
      <div class='chat-message-text' @click='showTime = !showTime'>
        {{ message.text }}
      </div>
    </div>
    <span v-if='showReadIcon' class='material-icons read-icon'>visibility</span>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Message from "@/entities/message";

  export default defineComponent({
    name: "ChatMessage",
    props: {
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
    }
  })
</script>

<style scoped lang='scss'>
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
    }

    .chat-message-time {
      margin-left: .35rem;
      padding-top: .25rem;
      color: var(--grey-text);
    }

    .chat-message-text {
      padding: .5rem .75rem;
      background-color: var(--grey-light);
      border-radius: 8px;
      white-space: pre-wrap;
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
      opacity: .8;
    }
  }
</style>
