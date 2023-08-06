// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from "firebase/app";
// Функція для підключення авторизації в проект
import { getAuth } from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAB07K20A--NJaywtOKfPUAnMhoCE8J8pA",
  authDomain: "my-react-evg.firebaseapp.com",
  databaseURL: "https://my-react-evg-default-rtdb.firebaseio.com",
  projectId: "my-react-evg",
  storageBucket: "my-react-evg.appspot.com",
  messagingSenderId: "1029141002083",
  appId: "1:1029141002083:web:520b579906f2cf4c5c8556",
  measurementId: "G-4K8SEZ2YJ6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
