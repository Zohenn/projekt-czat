<template>
  <div id='chat-setting-color'>
    <div v-for='color in colors' class='chat-color-wrapper' :class='color === newColor ? "selected" : ""' :key='color'
         :style='{ "--chat-color": color }'>
      <label :for='"chat-color-" + color' class='chat-color'>
        <input type='radio' :id='"chat-color-" + color' name='chat-color' v-model='newColor' :value='color'/>
      </label>
    </div>
    <button class='icon-btn'
            :style='{ "visibility": newColor !== color ? "visible": "hidden" }' @click='$emit("setColor", newColor)'>
      <MdIcon style='font-size: 18px;'>done</MdIcon>
    </button>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import MdIcon from "@/components/MdIcon.vue";

  export default defineComponent({
    name: "ChatSettingColor",
    components: { MdIcon },
    emits: ['setColor'],
    props: {
      color: {
        required: true,
        type: String,
      }
    },
    data() {
      return {
        colors: ['#009999', '#ed9e00', '#6b00e6'],
        newColor: this.color,
      }
    }
  })
</script>

<style scoped lang='scss'>
  #chat-setting-color {
    display: flex;
    align-items: center;
    margin-left: .5rem;
  }

  .chat-color-wrapper {
    display: flex;
    margin-right: .5rem;
    padding: 3px;
    border: 1px solid var(--grey);
    border-radius: 8px;

    &.selected {
      border-color: var(--chat-color);
    }
  }

  .chat-color {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background-color: var(--chat-color);
    border-radius: 8px;
    cursor: pointer;

    > input[type="radio"] {
      display: none;
    }
  }
</style>
