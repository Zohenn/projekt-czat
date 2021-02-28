<template>
  <ChatMessageList :chat='chat' style='flex-grow: 1;'/>
  <ChatMessageForm :chat='chat'/>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import ChatMessageList from "@/views/chat/ChatMessageList.vue";
  import ChatMessageForm from "@/views/chat/ChatMessageForm.vue";
  import Chat from "@/entities/chat";

  export default defineComponent({
    name: "ChatMessagesView",
    components: { ChatMessageForm, ChatMessageList },
    props: {
      chat: {
        required: true,
        type: Chat,
      }
    }
  })
</script>

<style scoped lang='scss'>

</style>
