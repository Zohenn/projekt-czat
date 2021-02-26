import firebase from "firebase";
import FirestoreDocument, {
  FirestoreDocumentInterface,
  StaticImplements
} from "@/entities/firestoreDocument";
import DocumentData = firebase.firestore.DocumentData;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

@StaticImplements<FirestoreDocumentInterface<AppUser>>()
export default class AppUser extends FirestoreDocument {
  constructor(public name: string, public surname: string, public email: string) {
    super();
  }

  static fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): AppUser {
    const data = snapshot.data();
    const user = new AppUser(data.name, data.surname, data.email);
    user.setDocReference(snapshot.ref);
    return user;
  }

  toFirestore(): DocumentData {
    return {
      name: this.name,
      surname: this.surname,
      email: this.email,
    };
  }

  get displayName() {
    return `${this.name} ${this.surname}`;
  }
}
