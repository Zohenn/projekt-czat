import { Module } from 'vuex';
import firebase from "firebase";
import AppUser from "@/entities/appUser";
import { firestore } from "@/firebase";
import { getConverter } from "@/entities/firestoreDocument";

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
        const authListener = firebase.auth().onAuthStateChanged(async (user) => {
          if(user !== null){
            state.user = (await firestore.collection('users').doc(user.uid).withConverter(getConverter(AppUser)).get()).data();
          }
          resolve();
          authListener();
        })
      });
    },

    async signIn({ state }, payload) {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
      state.user = (await firestore.collection('users').doc(userCredential.user?.uid).withConverter(getConverter(AppUser)).get()).data();
    },

    async signOut({ state }) {
      await firebase.auth().signOut();
      state.user = undefined;
    },

    async signUp({ state }, payload) {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password);

      const user = new AppUser(payload.name, payload.surname, payload.email);
      await firestore.collection('users').doc(userCredential.user?.uid).set({
        ...getConverter(AppUser).toFirestore(user),
        searchNS: `${user.name} ${user.surname}`.toLowerCase(),
        searchSN: `${user.surname} ${user.name}`.toLowerCase(),
      });
      state.user = (await firestore.collection('users').doc(userCredential.user?.uid).withConverter(getConverter(AppUser)).get()).data();
    }
  }
}
