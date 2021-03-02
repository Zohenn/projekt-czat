<template>
  <ChatMessageList :chat='chat' :pendingMessages='pendingMessages' @newMessage='onNewMessage($event)' style='flex-grow: 1;'/>
  <ChatMessageForm :chat='chat' @sendMessage='pendingMessages.unshift($event)'/>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import ChatMessageList from "@/views/chat/ChatMessageList.vue";
  import ChatMessageForm from "@/views/chat/ChatMessageForm.vue";
  import Chat from "@/entities/chat";
  import Message from "@/entities/message";

  export default defineComponent({
    name: "ChatMessagesView",
    components: { ChatMessageForm, ChatMessageList },
    props: {
      chat: {
        required: true,
        type: Chat,
      }
    },
    data() {
      return {
        pendingMessages: [] as Message[],
      };
    },

    methods: {
      onNewMessage(message: Message) {
        const index = this.pendingMessages.findIndex(m => m.id === message.id);
        if(index !== -1){
          this.pendingMessages.splice(index, 1);
        }
      }
    }
  })
</script>

<style scoped lang='scss'>

</style>
