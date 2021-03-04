<template>
  <PromiseHandler :promise='initPromise' class='centered-flex'>
    <div style='flex-grow: 1; overflow: auto;'>
      <div id='chat-images'>
        <div v-for='image in images' :key='image.file' class='chat-image'>
          <div class='chat-image-wrapper'>
            <img :src='$store.state.images.urls[`${chat.imagesPath}/${image.file}`]' alt='Zdjęcie'/>
          </div>
          <div class='chat-image-user'>
            <img src='../../assets/avatar.png' alt='Avatar'/>
            <div class='text-overflow'>
              <span>{{ $store.getters['users/getUserByUid'](image.author).displayName }}</span>
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
            .get();

        const newImages = [] as ChatImage[];
        querySnapshot.docs.forEach(snapshot => newImages.push(...snapshot.data().images));

        await Promise.all([...newImages.map(async image => {
          const url = await this.$store.dispatch('images/getUrlForPath', `${this.chat.imagesPath}/${image.file}`);
          await new Promise(resolve => {
            const img = new Image();
            img.onload = resolve;
            img.src = url;
          });
        })]);

        this.images.push(...newImages.reverse());
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
    border: 1px solid var(--grey);

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
    border-bottom: 1px solid var(--grey);

    > img {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .chat-image-user {
    display: flex;
    align-items: center;
    padding: .25rem .5rem;

    > img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-right: .5rem;
    }
  }
</style>
