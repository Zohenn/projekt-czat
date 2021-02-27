import Chat from "@/entities/chat";
import { Module } from "vuex";
import { firestore } from "@/firebase";
import { getConverter } from "@/entities/firestoreDocument";

interface ChatsState {
  chats: { [key: string]: Chat };
}

export const chats: Module<ChatsState, any> = {
  namespaced: true,
  state: {
    chats: {},
  },

  getters: {
    getChatByUid: state => (uid: string) => Object.values(state.chats).find(chat => chat.users.includes(uid)),
  },

  actions: {
    async fetchChat({ state, rootGetters }, uid: string) {
      const cuid = rootGetters['auth/uid'];
      for (const chat of Object.values(state.chats)) {
        if (chat.users.some(id => id === cuid || id === uid)) {
          return;
        }
      }

      const querySnapshot = await firestore.collection('chats')
        .where(`usersMap.${cuid}`, '==', true)
        .where(`usersMap.${uid}`, '==', true)
        .limit(1)
        .withConverter(getConverter(Chat)).get();

      if (querySnapshot.docs.length) {
        state.chats[querySnapshot.docs[0].id] = querySnapshot.docs[0].data();
      } else {
        const chat = new Chat([cuid, uid]);
        const docRef = firestore.collection('chats').doc();
        await docRef.set(chat.toFirestore());
        chat.setDocReference(docRef);
        state.chats[docRef.id] = chat;
      }
    }
  }
}
