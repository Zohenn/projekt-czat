import firebase from "firebase";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export default class AppUser {
  constructor(public name: string, public surname: string, public email: string) {
  }

  get displayName() {
    return `${this.name} ${this.surname}`;
  }
}

export const appUserConverter: FirestoreDataConverter<AppUser> = {
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return new AppUser(data.name, data.surname, data.email);
  },

  toFirestore(user: AppUser) {
    return {
      name: user.name,
      surname: user.surname,
      email: user.email,
    }
  }
}
