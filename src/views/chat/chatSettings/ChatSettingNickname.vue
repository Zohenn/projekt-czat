<template>
  <div class='chat-setting-wrapper chat-setting-nickname' :class='{ "active": active }' @click='active = true'>
    <div class='user-display-name'>{{ user.displayName }}</div>
    <form class='user-nickname-form' autocomplete='off' @submit.prevent='$emit("setNickname", newNickname); active = false'>
      <label :for='user.id + "-nickname"'/>
      <input :id='user.id + "-nickname"' class='user-nickname' type='text' :disabled='!active'
             v-model.trim='newNickname'/>
      <button type='submit' class='icon-btn' v-show='active'>
        <span class='material-icons' style='font-size: 18px;'>done</span>
      </button>
      <button type='button' class='icon-btn close-btn' v-show='active' @click.stop='active = false'>
        <span class='material-icons' style='font-size: 18px;'>close</span>
      </button>
    </form>
    <span class='material-icons edit-icon'>edit</span>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import AppUser from "@/entities/appUser";

  export default defineComponent({
    name: "ChatSettingNickname",
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
