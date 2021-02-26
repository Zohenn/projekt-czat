import { Module } from 'vuex';
import firebase from "firebase";
import AppUser, { appUserConverter } from "@/entities/appUser";
import { firestore } from "@/firebase";

export interface AuthState {
  authStateChecked: boolean;
  user: AppUser | undefined;
}

export const auth: Module<AuthState, any> = {
  namespaced: true,
  state: {
    authStateChecked: false,
    user: undefined,
  },
  getters: {
    isSignedIn({ user }): boolean {
      return user !== undefined;
    }
  },
  actions: {
    async checkAuthState({ state }) {
      await new Promise((resolve) => {
        firebase.auth().onAuthStateChanged(async (user) => {
          if(user !== null){
            console.log('siema');
            state.user = (await firestore.collection('users').doc(user.uid).withConverter(appUserConverter).get()).data();
          }
          resolve();
        })
      });
    },

    async signIn(_, payload) {
      await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
    },

    async signOut({ state }) {
      await firebase.auth().signOut();
      state.user = undefined;
    },

    async signUp({ state }, payload) {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password);

      const user = new AppUser(payload.name, payload.surname, payload.email);
      await firestore.collection('users').doc(userCredential.user?.uid).set({
        ...appUserConverter.toFirestore(user),
        searchNS: `${user.name} ${user.surname}`.toLowerCase(),
        searchSN: `${user.surname} ${user.name}`.toLowerCase(),
      });
      state.user = user;
    }
  }
}
