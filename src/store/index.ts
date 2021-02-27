import { createStore } from 'vuex'
import { auth } from "@/store/modules/auth";
import { chats } from "@/store/modules/chats";
import { users } from "@/store/modules/users";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    chats,
    users
  }
})
