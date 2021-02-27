import AppUser from "@/entities/appUser";
import { Module } from "vuex";
import { firestore } from "@/firebase";
import { getConverter } from "@/entities/firestoreDocument";

interface UsersState {
  users: {[key: string]: AppUser};
}

export const users: Module<UsersState, any> = {
  namespaced: true,
  state: {
    users: {}
  },

  getters: {
    getUserByUid: state => (uid: string) => state.users[uid],
  },

  actions: {
    async fetchUser({ state }, uid: string) {
      if(state.users[uid]){
        return;
      }

      const userSnapshot = await firestore.collection('users').doc(uid).withConverter(getConverter(AppUser)).get();
      if(!userSnapshot.exists){
        throw 'Użytkownik o podanym uid nie istnieje';
      }
      state.users[userSnapshot.id] = userSnapshot.data() as AppUser;
    }
  }
}
