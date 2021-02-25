<template>
  <div v-if='loading'>
    <span class='spinner-narrow'></span>
  </div>
  <template v-else>
    <slot v-if='success'></slot>
    <slot v-if='error' name='error'></slot>
  </template>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: "PromiseHandler",
    props: {
      promise: {
        type: Promise,
        required: true,
      },
    },
    data() {
      return {
        loading: true,
        success: false,
      }
    },
    created() {
      this.promise.then(() => this.success = true).finally(() => this.loading = false);
    }
  })
</script>

<style scoped lang='scss'>

</style>
