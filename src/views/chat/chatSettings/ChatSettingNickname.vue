<template>
  <div class='chat-setting-nickname' :class='{ "active": active }' @click='active = true'>
    <div class='user-display-name'>{{ user.displayName }}</div>
    <form class='user-nickname-form' autocomplete='off' @submit.prevent='$emit("setNickname", newNickname); active = false'>
      <label :for='user.id + "-nickname"'/>
      <input :id='user.id + "-nickname"' class='user-nickname' type='text' :disabled='!active'
             v-model.trim='newNickname'/>
      <button type='submit' class='icon-btn' v-show='active'>
        <MdIcon style='font-size: 18px;'>done</MdIcon>
      </button>
      <button type='button' class='icon-btn close-btn' v-show='active' @click.stop='active = false'>
        <MdIcon style='font-size: 18px;'>close</MdIcon>
      </button>
    </form>
    <MdIcon class='edit-icon'>edit</MdIcon>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import AppUser from "@/entities/appUser";
  import MdIcon from "@/components/MdIcon.vue";

  export default defineComponent({
    name: "ChatSettingNickname",
    components: { MdIcon },
    emits: ['setNickname'],
    props: {
      nickname: {
        required: true,
        type: String,
      },
      uid: {
        required: true,
        type: String,
      }
    },
    data() {
      return {
        active: false,
        newNickname: this.nickname,
      }
    },

    computed: {
      user(): AppUser {
        return this.$store.getters['users/getUserByUid'](this.uid);
      }
    },
  })
</script>

<style scoped lang='scss'>
  .chat-setting-nickname {
    display: flex;
    padding: .5rem;
  }

  .user-display-name {
    display: flex;
    align-items: center;
    width: 50%;
  }

  .user-nickname-form {
    display: flex;
    width: 50%;
  }

  .user-nickname {
    margin-right: .25rem;
    color: var(--primary-color);
    font-weight: 500;

    &[disabled] {
      background-color: transparent;
      border-color: transparent;
      cursor: pointer;
    }
  }

  .close-btn {
    color: var(--error-color);

    &:focus {
      background-color: var(--error-color-fade-strong);
      box-shadow: 0 0 3px 0 var(--error-color);
    }
  }
</style>
