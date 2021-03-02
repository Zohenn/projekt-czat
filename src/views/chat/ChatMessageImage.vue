<template>
  <PromiseHandler :promise='urlPromise' class='chat-message-image-spinner'>
    <img :src='url' alt='Zdjęcie do wiadomości'>
  </PromiseHandler>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import PromiseHandler from "@/components/PromiseHandler.vue";

  export default defineComponent({
    name: "ChatMessageImage",
    components: { PromiseHandler },
    props: {
      storageRef: {
        required: true,
        type: Object,
      }
    },
    data() {
      return {
        urlPromise: undefined as Promise<void> | undefined,
        url: '',
      }
    },

    created() {
      this.urlPromise = this.storageRef.getDownloadURL().then((url: string) => this.url = url);
    }
  })
</script>

<style scoped lang='scss'>
  .chat-message-image-spinner {
    padding: .5rem;
    background-color: var(--grey-light);
  }
</style>
