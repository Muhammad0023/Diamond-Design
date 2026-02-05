import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1s9rc5xnn4yvxK1HHWPbt5-nQMyOZ4N0",
  authDomain: "diamond-design-49de2.firebaseapp.com",
  projectId: "diamond-design-49de2",
  storageBucket: "diamond-design-49de2.firebasestorage.app",
  messagingSenderId: "831258362132",
  appId: "1:831258362132:web:ceda6af10fbdde203b8201",
  measurementId: "G-8HFVDL6CLV"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
