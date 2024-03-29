<template>
  <PromiseHandler :promise='initPromise' class='centered-flex'>
    <div id='chat-messages-container' ref='container' @scroll='onScroll'>
      <ChatMessage v-for='message in pendingMessages' :key='message.id' :chat='chat' :message='message'
                   :pending='true'/>
      <template v-for='(message, i) in messages' :key='message.id'>
        <template v-if='message.isSystem'>
          <div class='chat-system-message'>{{ message.text }}</div>
        </template>
        <template v-else>
          <ChatMessage :chat='chat' :message='message' :forceShowTime='forceShowTime(i)'
                       :showReadIcon='showReadIcon(message)'/>
          <div v-if='showDate(i)' class='chat-message-date' :class='{ "is-first": i === messages.length - 1 }'>
            {{ formatDate(message) }}
          </div>
        </template>
      </template>
      <PromiseHandler v-if='fetchMorePromise' :promise='fetchMorePromise' class='centered-flex'
                      style='padding-top: .5rem;'/>
      <div v-if='messages.length === 0' class='centered-flex'>Napisz pierwszą wiadomość</div>
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
  import firebase from "firebase";
  import DocumentData = firebase.firestore.DocumentData;

  export default defineComponent({
    name: "ChatMessageList",
    emits: ['newMessage' as string],
    components: { ChatMessage, PromiseHandler },
    props: {
      chat: {
        required: true,
        type: Chat,
      },
      pendingMessages: {
        required: true,
        type: Array,
      }
    },
    data() {
      return {
        initPromise: this.init(),
        messages: [] as Message[],
        lastRead: {} as { [key: string]: string },
        lastReadSubscriber: undefined as VoidCallbackOrUndef,
        newMessagesSubscriber: undefined as VoidCallbackOrUndef,
        canFetchMore: false,
        fetchMorePromise: undefined as PromiseOrUndef<void>,
      }
    },

    computed: {
      uid(): string {
        return this.$store.getters['auth/uid'];
      }
    },

    mounted() {
      this.initPromise.then(() => {
        this.$nextTick(() => {
          this.$nextTick(() => {
            const container = this.$refs.container as HTMLElement;
            if(container.offsetHeight === container.scrollHeight && this.canFetchMore) {
              this.fetchMorePromise = this.fetchMore();
            }
          })
        })
      })
    },

    beforeUnmount() {
      this.lastReadSubscriber?.();
      this.newMessagesSubscriber?.();
    },

    methods: {
      async init() {
        const querySnapshot = await this.chat.docReference?.collection('messages')
            .orderBy('date', 'desc')
            .limit(20).withConverter(getConverter(Message)).get();

        querySnapshot.docs.forEach(snapshot => this.messages.push(snapshot.data()));
        this.canFetchMore = querySnapshot.docs.length == 20;

        const lastReadPromise = new Promise(resolve => {
          this.lastReadSubscriber = this.chat.docReference.collection('lastRead').doc('_')
              .onSnapshot(snapshot => {
                if (snapshot.exists) {
                  this.lastRead = (snapshot.data() as DocumentData).lastRead;
                }
                resolve();
              })
        });

        await Promise.all([lastReadPromise, this.loadImagesForMessages(this.messages)])

        if (this.messages.length) {
          this.updateReadStatus();
        }

        this.newMessagesSubscriber = this.chat.docReference?.collection('messages')
            .where('date', '>', this.messages[0]?.date ?? new Date(0))
            .orderBy('date', 'desc')
            .withConverter(getConverter(Message))
            .onSnapshot(querySnapshot => {
              if (querySnapshot.docChanges().length > 0) {
                let hasSystemMessage = false;
                const newMessages: Message[] = [];
                querySnapshot.docChanges().forEach(docChange => {
                  const message = docChange.doc.data();
                  newMessages.push(message);

                  if (!message.isSystem) {
                    this.$emit('newMessage', message);
                  } else {
                    hasSystemMessage = true;
                  }
                });

                this.loadImagesForMessages(newMessages).then(() => {
                  this.messages.unshift(...newMessages);
                  this.updateReadStatus();
                });

                if (hasSystemMessage) {
                  this.$store.dispatch('chats/refresh', this.chat.id);
                }
              }
            });
      },

      updateReadStatus() {
        const newestMessage = this.messages.find(message => !message.isSystem);
        if (newestMessage && newestMessage.author !== this.uid && newestMessage.id !== this.lastRead[this.uid]) {
          this.chat.docReference.collection('lastRead').doc('_').set({
            lastRead: {
              [this.uid]: newestMessage.id,
            }
          }, { merge: true });
        }
      },

      forceShowTime(i: number) {
        return i === this.messages.length - 1 ||
            this.messages[i].author !== this.messages[i + 1].author ||
            Math.floor((this.messages[i].date.getTime() - this.messages[i + 1].date.getTime()) / (60 * 1000)) > 5;
      },

      showDate(i: number) {
        const firstDate = this.messages[i].date, secondDate = this.messages[i + 1]?.date;
        return i === this.messages.length - 1 ||
            !(firstDate.getDay() === secondDate.getDay() &&
                firstDate.getMonth() === secondDate.getMonth() &&
                firstDate.getFullYear() === secondDate.getFullYear()
            );
      },

      formatDate(message: Message): string {
        const now = new Date();
        return message.date.toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: 'short',
          year: now.getFullYear() !== message.date.getFullYear() ? 'numeric' : undefined
        })
      },

      showReadIcon(message: Message): boolean {
        return message.author === this.uid && this.lastRead[this.chat.getOtherUserTo(this.uid)] === message.id;
      },

      loadImagesForMessages(messages: Message[]): Promise<void[]> {
        const imagePromises = [] as Promise<void>[];

        for (const message of messages) {
          if (message.images.length > 0) {
            imagePromises.push(...message.images.map(async image => {
              const url = await this.$store.dispatch('images/getUrlForPath', `${this.chat.imagesPath}/${image}`);
              await new Promise(resolve => {
                const img = new Image();
                img.onload = resolve;
                img.src = url;
              });
            }));
          }
        }

        return Promise.all(imagePromises);
      },

      async fetchMore() {
        const querySnapshot = await this.chat.docReference.collection('messages')
            .where('date', '<', this.messages[this.messages.length - 1].date)
            .orderBy('date', 'desc')
            .limit(10)
            .withConverter(getConverter(Message))
            .get();

        const newMessages = [] as Message[];
        querySnapshot.docs.forEach(snapshot => newMessages.push(snapshot.data()));
        await this.loadImagesForMessages(newMessages);
        this.messages.push(...newMessages);
        this.canFetchMore = querySnapshot.docs.length === 10;

        this.fetchMorePromise = undefined;
      },

      onScroll() {
        if (this.canFetchMore && !this.fetchMorePromise) {
          const container = this.$refs.container as HTMLElement;
          if (Math.round(container.offsetHeight - container.scrollTop) >= container.scrollHeight - 5) {
            this.fetchMorePromise = this.fetchMore();
            this.$nextTick(() => {
              container.scrollTo({ top: container.offsetHeight - container.scrollHeight });
            });
          }
        }
      }
    }
  })
</script>

<style scoped lang='scss'>
  #chat-messages-container {
    display: flex;
    flex-direction: column-reverse;
    padding: .5rem 0;
    margin-top: auto;
    overflow: auto;

    .chat-message-date {
      padding: 2rem 0 .5rem;
      text-align: center;
      color: var(--grey-text);

      &.is-first {
        padding-top: .5rem;
      }
    }

    .chat-system-message {
      font-size: .9rem;
      padding: 1.25rem 1rem .5rem;
      color: var(--grey-text-light);
      text-align: center;
    }
  }
</style>
