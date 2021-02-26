import firebase from "firebase";
import DocumentReference = firebase.firestore.DocumentReference;
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;
import DocumentData = firebase.firestore.DocumentData;

export function StaticImplements<T>() {
  return (constructor: T) => {
  };
}

export interface FirestoreDocumentInterface<T extends FirestoreDocument> {
  fromFirestore(snapshot: QueryDocumentSnapshot): T;
}

export default abstract class FirestoreDocument {
  get docReference(): firebase.firestore.DocumentReference | undefined {
    return this._docReference;
  }

  setDocReference(value: firebase.firestore.DocumentReference) {
    this._docReference = value;
  }

  private _docReference: DocumentReference | undefined;

  get id(): string | undefined {
    return this._docReference?.id;
  }

  abstract toFirestore(): DocumentData;
}

export function getConverter<T extends FirestoreDocument>(type: FirestoreDocumentInterface<T>) {
  return {
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot): T {
      return type.fromFirestore(snapshot) as T;
    },

    toFirestore(modelObject: T): DocumentData {
      return modelObject.toFirestore();
    }
  } as FirestoreDataConverter<T>;
}
