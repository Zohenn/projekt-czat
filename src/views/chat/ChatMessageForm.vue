<template>
  <div id='chat-input-container'>
    <div v-show='images.length > 0' class='chat-message-form-images'>
      <div v-for='(image, i) in images' :key='image' class='chat-message-form-image'>
        <img :src='image.data' alt='Zdjęcie do wiadomości'/>
        <div class='chat-message-image-overlay' @click='images.splice(i, 1)'>
          <MdIcon>close</MdIcon>
        </div>
      </div>
    </div>
    <div class='d-flex align-items-center' style='padding: .5rem 1rem;'>
      <label for='chat-message-add-image' class='d-none'>
        <input id='chat-message-add-image' ref='imageForm' type='file' accept='image/*' multiple @change='addImages'/>
      </label>
      <button class='icon-btn' @click='$refs.imageForm.click()'>
        <MdIcon>add_photo_alternate</MdIcon>
      </button>
      <div style='flex-grow: 1; margin: 0 1rem;'>
        <div id='chat-message-input-wrapper'>
          <div id='chat-message-input' contenteditable='true' @input='text = $event.target.innerText.trim()' ref='input'
               @keypress.enter='onKeyUp'></div>
          <div v-show='text === ""' class='placeholder'>Aa</div>
        </div>
      </div>
      <button class='icon-btn' @click='sendMessage'><MdIcon>send</MdIcon></button>
    </div>
  </div>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';
  import Chat from "@/entities/chat";
  import firebase from "firebase";
  import FieldValue = firebase.firestore.FieldValue;
  import Message from "@/entities/message";
  import { firebaseStorage } from "@/firebase";
  import UploadTask = firebase.storage.UploadTask;
  import { v4 as uuidv4 } from 'uuid';
  import MdIcon from "@/components/MdIcon.vue";

  interface ChatMessageFormImage {
    data: string;
    filename: string;
  }

  export default defineComponent({
    name: "ChatMessageForm",
    components: { MdIcon },
    emits: ['sendMessage'],
    props: {
      chat: {
        required: true,
        type: Chat,
      },
    },
    data() {
      return {
        text: '',
        images: [] as ChatMessageFormImage[],
      }
    },

    methods: {
      addImages(e: Event) {
        const input = e.target as HTMLInputElement;
        for (const file of input.files as FileList) {
          const reader = new FileReader();
          reader.onload = (e) => this.images.push({ data: e.target?.result as string, filename: file.name });
          reader.readAsDataURL(file);
        }

        input.value = '';
      },

      onKeyUp(e: KeyboardEvent) {
        if (!e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      },

      async sendMessage() {
        if (this.text == '') {
          return;
        }

        const batch = this.chat.docReference.firestore.batch();
        const message = new Message(
            this.$store.getters['auth/uid'],
            new Date(),
            this.text,
            [],
        );
        const messageRef = this.chat.docReference.collection('messages').doc();
        message.setDocReference(messageRef);

        this.$emit('sendMessage', message);

        this.text = '';
        (this.$refs.input as HTMLElement).innerHTML = '';

        const imageFiles = [] as string[];

        if (this.images.length > 0) {
          const imagesRef = firebaseStorage.ref(this.chat.imagesPath);
          const uploadPromises = [] as UploadTask[];
          for (const image of this.images) {
            const filenameParts = image.filename.split('.');
            const filename = `${uuidv4()}.${filenameParts[filenameParts.length - 1]}`;
            imageFiles.push(filename);
            uploadPromises.push(imagesRef.child(filename).putString(image.data, 'data_url'));
          }

          this.images.splice(0, this.images.length);

          await Promise.all(uploadPromises);

          const imageBatchSnapshot = await this.chat.docReference.collection('images')
              .orderBy('no')
              .limitToLast(1)
              .get();

          const mappedImages = imageFiles.map(file => {
            return {
              author: this.$store.getters['auth/uid'],
              date: new Date(),
              file,
            };
          });

          const imageBatchData = imageBatchSnapshot.docs[0]?.data();

          if(imageBatchSnapshot.empty || imageBatchData.images.length >= 15){
            batch.set(this.chat.docReference.collection('images').doc(), {
              no: imageBatchSnapshot.empty ? 0 : imageBatchData.no + 1,
              images: mappedImages,
            }, { merge: true });
          } else {
            // todo: transaction? change images to map, so serverTimestamp can be used?
            batch.set(imageBatchSnapshot.docs[0].ref, {
              images: [...imageBatchData.images, ...mappedImages],
            }, { merge: true });
          }
        }

        const messageData = { ...message.toFirestore(), date: FieldValue.serverTimestamp(), images: imageFiles};

        batch.set(messageRef, messageData);
        batch.update(this.chat.docReference, {
          lastMessage: messageData,
        });

        // todo: remove images from storage if this fails
        await batch.commit();
      }
    }
  })
</script>

<style scoped lang='scss'>
  #chat-input-container {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--grey);
  }

  .chat-message-form-images {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--grey);

    .chat-message-form-image {
      position: relative;
      width: 3rem;
      height: 3rem;
      margin-left: .5rem;
      border-radius: 8px;
      overflow: hidden;

      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .chat-message-image-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: grid;
        place-content: center;
        background-color: rgba(0, 0, 0, 0);
        z-index: 1;
        cursor: pointer;
        transition: background-color .2s;

        & > span {
          color: transparent;
          transition: color .2s;
        }
      }

      &:hover {
        .chat-message-image-overlay {
          background-color: rgba(0, 0, 0, 0.3);

          & > span {
            color: white;
          }
        }
      }
    }
  }

  #chat-message-input-wrapper {
    position: relative;

    .placeholder {
      position: absolute;
      top: calc(.5rem + 1px);
      left: calc(.75rem + 2px);
      color: var(--grey-text);
    }
  }

  #chat-message-input {
    width: 100%;
    padding: .5rem .75rem;
    line-height: 1.25em;
    min-height: 2.25em;
    max-height: 6em;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
</style>
