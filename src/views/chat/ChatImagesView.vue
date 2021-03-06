<template>
  <PromiseHandler :promise='initPromise' class='centered-flex'>
    <div id='chat-images' ref='container' @scroll='onScroll'>
      <div v-for='image in images' :key='image.file' class='chat-image'>
        <div class='chat-image-wrapper'>
          <img :src='$store.state.images.urls[`${chat.imagesPath}/${image.file}`]' alt='Zdjęcie'/>
          <div class='chat-image-overlay'>
            <div class='chat-image-info'>
              <div class='chat-image-user'>
                <img src='../../assets/avatar.png' alt='Avatar'/>
                <div class='text-overflow'>
                    <span :title='chat.getNicknameFor($store.getters["users/getUserByUid"](image.author))'>
                      {{ chat.getNicknameFor($store.getters['users/getUserByUid'](image.author)) }}
                    </span>
                </div>
              </div>
              <div class='chat-image-date'>
                <span>{{ formatDate(image.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PromiseHandler v-if='fetchMorePromise' :promise='fetchMorePromise' class='centered-flex'
                      style='height: auto; padding: .5rem 0;'/>
      <!--        <button @click='fillImages'>Magiczny przycisk</button>-->
    </div>
    <div v-if='images.length === 0' class='centered-flex'>
      Wygląda na to, że nikt nie wysłał jeszcze żadnego zdjęcia 🤔
    </div>
  </PromiseHandler>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import PromiseHandler from "@/components/PromiseHandler.vue";
  import Chat from "@/entities/chat";
  import firebase from 'firebase';
  import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
  import DocumentData = firebase.firestore.DocumentData;

  interface ImageBatch {
    no: number;
    images: ChatImage[];
  }

  interface ChatImage {
    author: string;
    date: Date;
    file: string;
  }

  const imageBatchConverter = {
    fromFirestore(snapshot: QueryDocumentSnapshot): ImageBatch {
      const data = snapshot.data();
      return {
        no: data.no,
        images: data.images.map((image: DocumentData) => {
          return {
            ...(image as ChatImage),
            date: image.date.toDate(),
          }
        }),
      };
    },
    toFirestore(modelObject: ImageBatch): DocumentData {
      return modelObject;
    }
  };

  export default defineComponent({
    name: "ChatImagesView",
    components: { PromiseHandler },
    props: {
      chat: {
        required: true,
        type: Chat,
      }
    },

    data() {
      return {
        initPromise: this.init(),
        images: [] as ChatImage[],
        lastBatchNo: undefined as number | undefined,
        newestBatchSubscriber: undefined as VoidCallbackOrUndef,
        fetchMorePromise: undefined as PromiseOrUndef<void>,
      }
    },

    mounted() {
      this.initPromise.then(() => {
        this.$nextTick(() => {
          this.$nextTick(() => {
            const container = this.$refs.container as HTMLElement;
            if (container.offsetHeight === container.scrollHeight && this.lastBatchNo && this.lastBatchNo > 0) {
              this.fetchMorePromise = this.fetchMore();
            }
          });
        });
      });
    },

    beforeUnmount() {
      this.newestBatchSubscriber?.();
    },

    methods: {
      async init() {
        await new Promise((resolve) => {
          this.newestBatchSubscriber = this.chat.docReference.collection('images')
              .orderBy('no')
              .limitToLast(1)
              .withConverter(imageBatchConverter)
              .onSnapshot(async querySnapshot => {
                const newImages = [] as ChatImage[];
                const docChange = querySnapshot.docChanges()[0];

                console.log('eee');
                // todo:
                if (docChange.type === 'added') {
                  newImages.push(...docChange.doc.data().images);
                }

                await Promise.all([...newImages.map(async image => {
                  const url = await this.$store.dispatch('images/getUrlForPath', `${this.chat.imagesPath}/${image.file}`);
                  await new Promise(resolve => {
                    const img = new Image();
                    img.onload = resolve;
                    img.src = url;
                  });
                })]);

                this.images.push(...newImages.reverse());

                if (this.lastBatchNo === undefined) {
                  this.lastBatchNo = querySnapshot.docs[0].data().no;
                }

                resolve();
              });
        })
      },

      formatDate(date: Date) {
        const now = new Date();
        return date.toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: 'short',
          year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
        })
      },

      async fetchMore() {
        const snapshot = await this.chat.docReference.collection('images')
            .where('no', '==', (this.lastBatchNo as number) - 1)
            .limit(1)
            .withConverter(imageBatchConverter)
            .get();

        if(snapshot.empty){
          return;
        }

        const newImages = [] as ChatImage[];
        newImages.push(...snapshot.docs[0].data().images);

        await Promise.all([...newImages.map(async image => {
          const url = await this.$store.dispatch('images/getUrlForPath', `${this.chat.imagesPath}/${image.file}`);
          await new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.src = url;
          });
        })]);

        this.images.push(...newImages);
        this.fetchMorePromise = undefined;
        (this.lastBatchNo as number)--;
      },

      onScroll() {
        if ((this.lastBatchNo as number) > 0 && !this.fetchMorePromise) {
          const container = this.$refs.container as HTMLElement;
          if (container.scrollTop === container.scrollHeight - container.offsetHeight) {
            this.fetchMorePromise = this.fetchMore();
            this.$nextTick(() => {
              container.scrollTo({ top: container.scrollHeight });
            });
          }
        }
      },

      async fillImages() {
        const doc = this.chat.docReference.collection('images').doc('6rfIbDcEk8A7OT1OzzjK');
        const docSnapshot = await doc.get();
        const data = docSnapshot.data() as DocumentData;

        while (data.images.length < 15) {
          data.images.push({
            author: 'lAsSaALrdhbHV43M109pGP803Za2',
            date: new Date(),
            file: '427f080f-6e65-47c8-af57-d51e22611f27.jpg',
          });
        }

        await doc.set(data);

        // const nextDoc = this.chat.docReference.collection('images').doc();
        // await nextDoc.set({
        //   no: 2,
        //   images: Array.from({ length: 2 }, () => {
        //     return {
        //       author: 'lAsSaALrdhbHV43M109pGP803Za2',
        //       date: new Date(),
        //       file: '427f080f-6e65-47c8-af57-d51e22611f27.jpg',
        //     };
        //   }),
        // });
      }
    }
  })
</script>

<style scoped lang='scss'>
  #chat-images {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
  }

  .chat-image {
    width: 33.33%;
    margin-bottom: .5rem;
    //border: 1px solid var(--grey);
    padding: 1px;

    &:nth-child(4n + 1) {
      padding-left: 1px;
    }

    &:nth-child(4n) {
      padding-right: 1px;
    }
  }

  .chat-image-wrapper {
    position: relative;
    padding-top: 100%;
    //border-bottom: 1px solid var(--grey);

    > img {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .chat-image-overlay {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      background: linear-gradient(to bottom, transparent, transparent 75%, rgba(0, 0, 0, 0.8));
    }

    .chat-image-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .5rem .75rem .5rem .5rem;
      color: white;
    }

    .chat-image-user {
      display: flex;
      align-items: center;
      color: white;
      margin-right: .5rem;
      min-width: 0;

      > img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: .5rem;
      }
    }

    @media screen and (max-width: 576px) {
      .chat-image-info {
        justify-content: flex-end;
      }

      .chat-image-user {
        display: none;
      }
    }

    .chat-image-date {
      white-space: nowrap;
    }
  }
</style>
