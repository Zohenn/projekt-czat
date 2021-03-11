<template>
  <slot :openModal='openModal'>
    <img :src='src' :alt='alt' v-bind='$attrs' class='chat-image' @click='modalOpen = true'/>
  </slot>
  <teleport to='body'>
    <div v-if='modalOpen' class='image-modal'>
      <div class='image-modal-container' @click='modalOpen = false'>
        <img :src='src' :alt='alt' @click.stop/>
        <button class='image-modal-close-btn icon-btn' @click='modalOpen = false'><MdIcon>close</MdIcon></button>
      </div>
    </div>
  </teleport>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import MdIcon from "@/components/MdIcon.vue";

  export default defineComponent({
    name: "ChatImage",
    components: { MdIcon },
    props: {
      src: {
        required: true,
        type: String,
      },
      alt: {
        required: true,
        type: String,
      }
    },
    data() {
      return {
        modalOpen: false,
      }
    },

    methods: {
      openModal() {
        this.modalOpen = true;
      }
    }
  })
</script>

<style lang='scss'>
  .chat-image {
    cursor: pointer;

    &:hover {
      filter: brightness(80%);
    }
  }

  .image-modal {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #1a1a1a;
    z-index: 1000;
  }

  .image-modal-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      object-fit: cover;
      max-height: 100%;
    }

    .image-modal-close-btn {
      position: absolute;
      top: 1rem;
      left: 1rem;

      &:hover {
        background-color: var(--primary-color-fade-strong);
      }

      &:focus {
        background-color: var(--primary-color-fade);
      }
    }
  }
</style>
