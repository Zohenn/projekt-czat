<template>
  <PromiseHandler :promise='initPromise' class='centered-flex'>
    <div id='chat-messages-container' v-bind='$attrs'>
      <ChatMessage v-for='(message, i) in messages' :key='message.id' :message='message'
                   :forceShowTime='forceShowTime(i)' :showReadIcon='i === 0'/>
    </div>
  </PromiseHandler>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Chat from "@/entities/chat";
  import Message from "@/entities/message";
  import PromiseHandler from "@/components/PromiseHandler.vue";
  import { getConverter } from "@/entities/firestoreDocument";
  import ChatMessage from "@/views/chat/ChatMessage.vue";

  export default defineComponent({
    name: "ChatMessageList",
    components: { ChatMessage, PromiseHandler },
    props: {
      chat: {
        required: true,
        type: Chat,
      }
    },
    data() {
      return {
        initPromise: undefined as Promise<void> | undefined,
        messages: [] as Message[],
        newMessagesSubscriber: undefined as (() => void) | undefined,
      }
    },

    created() {
      this.initPromise = this.chat.docReference?.collection('messages')
          .orderBy('date', 'desc')
          .limit(20).withConverter(getConverter(Message)).get()
          .then(querySnapshot => {
            querySnapshot.docs.forEach(snapshot => this.messages.push(snapshot.data()));

            this.newMessagesSubscriber = this.chat.docReference?.collection('messages')
                .where('date', '>', this.messages[0]?.date ?? null)
                .orderBy('date', 'desc')
                .withConverter(getConverter(Message))
                .onSnapshot(querySnapshot => {
                  if(querySnapshot.docChanges().length > 0){
                    const newMessages: Message[] = [];
                    querySnapshot.docChanges().forEach(docChange => newMessages.push(docChange.doc.data()));
                    this.messages.unshift(...newMessages);
                  }
                })
          });
    },

    beforeUnmount() {
      this.newMessagesSubscriber?.();
    },

    methods: {
      forceShowTime(i: number) {
        return i === this.messages.length - 1 ||
            this.messages[i].author !== this.messages[i + 1].author ||
            Math.floor(Math.floor((this.messages[i].date.getTime() - this.messages[i + 1].date.getTime()) / (60 * 1000))) > 5;
      }
    }
  })
</script>

<style scoped lang='scss'>
  #chat-messages-container {
    display: flex;
    flex-direction: column-reverse;
    padding: .5rem 0;
  }
</style>