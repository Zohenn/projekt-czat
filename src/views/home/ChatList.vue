<template>
  <PromiseHandler :promise='initPromise'>
    <div id='last-chats-container'>
      <ChatListItem v-for='chat in chats' :key='chat.id' :chat='chat'/>
    </div>
  </PromiseHandler>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import PromiseHandler from "@/components/PromiseHandler.vue";
  import ChatListItem from "@/views/home/ChatListItem.vue";

  export default defineComponent({
    name: "ChatList",
    components: { ChatListItem, PromiseHandler },
    data() {
      return {
        initPromise: this.$store.dispatch('chats/initLastChats'),
      }
    },

    computed: {
      chats() {
        return this.$store.state.chats.lastChats;
      }
    }
  })
</script>

<style scoped lang='scss'>
  #last-chats-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
</style>
