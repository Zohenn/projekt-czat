import { createStore } from 'vuex'
import { auth } from "@/store/modules/auth";
import { chats } from "@/store/modules/chats";
import { users } from "@/store/modules/users";
import { images } from "@/store/modules/images";

const modules = {
  auth,
  chats,
  users
}

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
    reset({ dispatch }){
      for(const module in modules) {
        if(module == 'auth'){
          continue;
        }
        dispatch(`${module}/reset`);
      }
    }
  },
  modules: {
    auth,
    chats,
    images,
    users
  }
})
