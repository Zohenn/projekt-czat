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
            state.user = (await firestore.collection('users').doc(user.uid).withConverter(appUserConverter).get()).data();
          }
          resolve();
        })
      });
    },

    async signIn({ state }, payload) {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);

      state.user = (await firestore.collection('users').doc(userCredential.user?.uid).withConverter(appUserConverter).get()).data();
    }
  }
}
