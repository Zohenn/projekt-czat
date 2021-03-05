<template>
  <PromiseHandler :promise='initPromise' class='centered-flex'>
    <div style='flex-grow: 1; overflow: auto;'>
      <div id='chat-images'>
        <div v-for='image in images' :key='image.file' class='chat-image'>
          <div class='chat-image-wrapper'>
            <img :src='$store.state.images.urls[`${chat.imagesPath}/${image.file}`]' alt='Zdjęcie'/>
            <div class='chat-image-overlay'>
              <div class='chat-image-info'>
                <div class='chat-image-user'>
                  <img src='../../assets/avatar.png' alt='Avatar'/>
                  <div class='text-overflow'>
                    <span>{{ chat.getNicknameFor($store.getters['users/getUserByUid'](image.author)) }}</span>
                  </div>
                </div>
                <div class='chat-image-date'>
                  <span>{{ formatDate(image.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  interface ChatImage {
    author: string;
    date: Date;
    file: string;
  }

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
      }
    },

    methods: {
      async init() {
        const querySnapshot = await this.chat.docReference.collection('images')
            .orderBy('no')
            .limitToLast(1)
            .withConverter({
              fromFirestore(snapshot: QueryDocumentSnapshot): ChatImage[] {
                const data = snapshot.data();
                return data.images.map((image: DocumentData) => {
                  return {
                    ...(image as ChatImage),
                    date: image.date.toDate(),
                  }
                });
              },
              toFirestore(modelObject: ChatImage[]): DocumentData {
                return modelObject;
              }
            })
            .get();

        const newImages = [] as ChatImage[];
        querySnapshot.docs.forEach(snapshot => newImages.push(...snapshot.data()));

        await Promise.all([...newImages.map(async image => {
          const url = await this.$store.dispatch('images/getUrlForPath', `${this.chat.imagesPath}/${image.file}`);
          await new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.src = url;
          });
        })]);

        this.images.push(...newImages.reverse());
      },

      formatDate(date: Date) {
        const now = new Date();
        return date.toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: 'short',
          year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
        })
      }
    }
  })
</script>

<style scoped lang='scss'>
  #chat-images {
    display: flex;
    flex-wrap: wrap;
  }

  .chat-image {
    width: 33.33%;
    margin-bottom: .5rem;
    //border: 1px solid var(--grey);
    padding: 1px;

    &:nth-child(4n + 1) {
      border-left: 0;
      padding-left: 1px;
    }

    &:nth-child(4n) {
      border-right: 0;
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
      background: linear-gradient(to bottom, transparent, transparent 50%, rgba(0, 0, 0, 0.9));
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
