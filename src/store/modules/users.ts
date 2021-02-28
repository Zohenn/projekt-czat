import AppUser from "@/entities/appUser";
import { Module } from "vuex";
import { firestore } from "@/firebase";
import { getConverter } from "@/entities/firestoreDocument";

interface UsersState {
  users: {[key: string]: AppUser};
}

const initialState: () => UsersState = () => {
  return {
    users: {}
  };
};

export const users: Module<UsersState, any> = {
  namespaced: true,
  state: initialState(),

  getters: {
    getUserByUid: state => (uid: string) => state.users[uid],
  },

  actions: {
    async fetchUser({ state }, uid: string) {
      if(!state.users[uid]){
        const userSnapshot = await firestore.collection('users').doc(uid).withConverter(getConverter(AppUser)).get();
        if(!userSnapshot.exists){
          throw 'Użytkownik o podanym uid nie istnieje';
        }
        state.users[uid] = userSnapshot.data() as AppUser;
      }

      return state.users[uid];
    },

    reset({ state }) {
      Object.assign(state, initialState());
    }
  }
}
