import Chat from "@/entities/chat";
import { Module } from "vuex";
import { firestore } from "@/firebase";
import { getConverter } from "@/entities/firestoreDocument";

interface ChatsState {
  chats: { [key: string]: Chat };
  lastChats: Chat[];
  lastChatsSubscription: (() => void) | undefined;
}

const initialState: () => ChatsState = () => {
  return {
    chats: {},
    lastChats: [],
    lastChatsSubscription: undefined,
  };
};

export const chats: Module<ChatsState, any> = {
  namespaced: true,
  state: initialState(),

  getters: {
    getChatByUid: state => (uid: string) => Object.values(state.chats).find(chat => chat.users.includes(uid)),
  },

  actions: {
    async fetchChat({ state, rootGetters }, uid: string) {
      const cuid = rootGetters['auth/uid'];
      for (const chat of Object.values(state.chats)) {
        if (chat.users.includes(uid) && chat.users.includes(cuid)) {
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
    },

    async initLastChats({ state, rootGetters, dispatch }) {
      if(state.lastChatsSubscription){
        return;
      }

      const uid = rootGetters['auth/uid'];
      const querySnapshot = await firestore.collection('chats')
        .where('users', 'array-contains', uid)
        .orderBy('lastMessage.date', 'desc')
        .limit(10)
        .withConverter(getConverter(Chat))
        .get();

      const users: Set<string> = new Set();

      querySnapshot.docs.forEach(snapshot => {
        const chat = snapshot.data();
        users.add(chat.getOtherUserTo(uid));
        state.lastChats.push(chat);
        state.chats[chat.id] = chat;
      });

      await Promise.all(Array.from(users).map(u => dispatch('users/fetchUser', u, { root: true })));

      state.lastChatsSubscription = firestore.collection('chats')
        .where('users', 'array-contains', uid)
        .where('lastMessage.date', '>', state.lastChats[0]?.lastMessage?.date ?? new Date(0))
        .orderBy('lastMessage.date', 'desc')
        .withConverter(getConverter(Chat))
        .onSnapshot(querySnapshot => {
          const newChats: Chat[] = [];
          querySnapshot.docChanges().forEach(docChange => {
            const chat = docChange.doc.data();
            const oldIndex = state.lastChats.findIndex(c => c.id === chat.id);
            if(oldIndex !== -1){
              state.lastChats.splice(oldIndex, 1);
            }

            state.chats[chat.id] = chat;
            newChats.push(chat);
          });

          state.lastChats.unshift(...newChats);
        });
    },

    async refresh({ state }, id: string) {
      const snapshot = await firestore.collection('chats').doc(id).withConverter(getConverter(Chat)).get();
      if(snapshot.exists){
        state.chats[id] = snapshot.data() as Chat;
      }
    },

    reset({ state }) {
      state.lastChatsSubscription?.();
      Object.assign(state, initialState());
    }
  }
}
