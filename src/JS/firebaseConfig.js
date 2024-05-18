import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZZdZU7WAvtqAkVXaXp9e-wwkGpP9SIHc",
  authDomain: "wirefully-9a5b7.firebaseapp.com",
  projectId: "wirefully-9a5b7",
  storageBucket: "wirefully-9a5b7.appspot.com",
  messagingSenderId: "546911973623",
  appId: "1:546911973623:web:d34fd7a56a1182b46e63f2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);