import { Module } from 'vuex';
import firebase from "firebase";
import AppUser from "@/entities/appUser";
import { firestore } from "@/firebase";
import { getConverter } from "@/entities/firestoreDocument";

export interface AuthState {
  authStateChecked: boolean;
  user: AppUser | undefined;
}

const initialState: () => AuthState = () => {
  return {
    authStateChecked: false,
    user: undefined
  }
};

export const auth: Module<AuthState, any> = {
  namespaced: true,
  state: initialState(),

  getters: {
    isSignedIn({ user }): boolean {
      return user !== undefined;
    },

    uid({ user }): string | undefined {
      return user?.id;
    }
  },

  actions: {
    async checkAuthState({ state, dispatch }) {
      await new Promise((resolve) => {
        const authListener = firebase.auth().onAuthStateChanged(async (user) => {
          if (user !== null) {
            state.user = await dispatch('users/fetchUser', user.uid, { root: true });
          }
          resolve();
          authListener();
        })
      });
    },

    async signIn({ state, dispatch }, payload) {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
      state.user = await dispatch('users/fetchUser', userCredential.user?.uid, { root: true });
    },

    async signOut({ state, dispatch }) {
      await dispatch('reset', null, { root: true });
      await firebase.auth().signOut();
      Object.assign(state, initialState());
    },

    async signUp({ state, dispatch }, payload) {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password);

      const user = new AppUser(payload.name, payload.surname, payload.email);
      await firestore.collection('users').doc(userCredential.user?.uid).set({
        ...getConverter(AppUser).toFirestore(user),
        searchNS: `${user.name} ${user.surname}`.toLowerCase(),
        searchSN: `${user.surname} ${user.name}`.toLowerCase(),
      });
      state.user = await dispatch('users/fetchUser', userCredential.user?.uid, { root: true });
    }
  }
}
