import { Module } from "vuex";
import { firebaseStorage } from "@/firebase";

interface ImagesState {
  urls: {[path: string]: string};
}

const initialState: (() => ImagesState) = () => {
  return {
    urls: {},
  }
};

export const images: Module<ImagesState, any> = {
  namespaced: true,
  state: initialState,

  actions: {
    async getUrlForPath({ state }, path) {
      if(!state.urls[path]){
        state.urls[path] = await firebaseStorage.ref(path).getDownloadURL();
      }

      return state.urls[path];
    },

    reset({ state }) {
      Object.assign(state, initialState());
    }
  }
}
