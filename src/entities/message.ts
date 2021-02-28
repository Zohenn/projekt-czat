import FirestoreDocument, { FirestoreDocumentInterface, StaticImplements } from "@/entities/firestoreDocument";
import firebase from "firebase/app";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

@StaticImplements<FirestoreDocumentInterface<Message>>()
export default class Message extends FirestoreDocument {
  constructor(public author: string, public date: Date, public text: string) {
    super();
  }

  static fromFirestore(snapshot: QueryDocumentSnapshot): Message {
    const data = snapshot.data();
    const message = new Message(data.author, data.date.toDate(), data.text);
    message.setDocReference(snapshot.ref);
    return message;
  }

  toFirestore(): firebase.firestore.DocumentData {
    return {
      author: this.author,
      date: this.date,
      text: this.text,
    };
  }

  get isSystem(): boolean {
    return this.author === 'system';
  }
}
