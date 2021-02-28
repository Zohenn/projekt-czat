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
    async checkAuthState({ state }) {
      await new Promise((resolve) => {
        const authListener = firebase.auth().onAuthStateChanged(async (user) => {
          if (user !== null) {
            state.user =
              (await firestore.collection('users').doc(user.uid).withConverter(getConverter(AppUser)).get()).data();
          }
          resolve();
          authListener();
        })
      });
    },

    async signIn({ state }, payload) {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
      state.user =
        (await firestore.collection('users').doc(userCredential.user?.uid).withConverter(getConverter(AppUser))
          .get()).data();
    },

    async signOut({ state, dispatch }) {
      await dispatch('reset', null, { root: true });
      await firebase.auth().signOut();
      Object.assign(state, initialState());
    },

    async signUp({ state }, payload) {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password);

      const user = new AppUser(payload.name, payload.surname, payload.email);
      await firestore.collection('users').doc(userCredential.user?.uid).set({
        ...getConverter(AppUser).toFirestore(user),
        searchNS: `${user.name} ${user.surname}`.toLowerCase(),
        searchSN: `${user.surname} ${user.name}`.toLowerCase(),
      });
      state.user =
        (await firestore.collection('users').doc(userCredential.user?.uid).withConverter(getConverter(AppUser))
          .get()).data();
    }
  }
}
