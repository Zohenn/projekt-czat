import firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export default class AppUser {

  static fromFirestore(docSnapshot: DocumentSnapshot): AppUser {
    const data = docSnapshot.data();
    return Object.assign(new AppUser(), data);
  }
}
