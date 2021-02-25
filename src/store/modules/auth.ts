import { Module } from 'vuex';
import firebase from "firebase";
import AppUser from "@/entities/appUser";
import { firestore } from "@/firebase";

export interface AuthState {
  user: AppUser | null;
}

export const auth: Module<AuthState, any> = {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    isSignedIn({ user }) {
      return user != null;
    }
  },
  actions: {
    async signIn({ state }, payload) {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);

      state.user = AppUser.fromFirestore(await firestore.collection('users').doc(userCredential.user?.uid).get());
    }
  }
}
