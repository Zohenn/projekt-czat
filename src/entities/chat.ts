import FirestoreDocument, { FirestoreDocumentInterface, StaticImplements } from "@/entities/firestoreDocument";
import firebase from "firebase/app";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

interface LastMessage {
  author: string;
  date: Date;
  text: string;
  images: string[];
}

@StaticImplements<FirestoreDocumentInterface<Chat>>()
export default class Chat extends FirestoreDocument {
  constructor(public users: string[], public lastMessage?: LastMessage, public nicknames?: { [key: string]: string }, public color?: string) {
    super();
  }

  static fromFirestore(snapshot: QueryDocumentSnapshot): Chat {
    const data = snapshot.data();
    const chat = new Chat(data.users, {
      ...data.lastMessage,
      date: data.lastMessage?.date?.toDate()
    }, { ...data.nicknames }, data.color ?? '#009999');
    chat.setDocReference(snapshot.ref);
    return chat;
  }

  toFirestore(): firebase.firestore.DocumentData {
    return {
      users: this.users,
      usersMap: Object.fromEntries(this.users.map(user => [user, true])),
    };
  }

  getOtherUserTo(uid: string): string {
    return this.users.find(u => u !== uid) as string;
  }
}
