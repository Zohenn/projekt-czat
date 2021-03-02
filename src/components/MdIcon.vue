<template>
  <span class='material-icons'><slot></slot></span>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: "MdIcon"
  })
</script>
