import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyByJPOxG9Pe4kj8ogMpRUBHK12BA-olSAo",
    authDomain: "report-hub-bfc1c.firebaseapp.com",
    projectId: "report-hub-bfc1c",
    storageBucket: "report-hub-bfc1c.firebasestorage.app",
    messagingSenderId: "690798254228",
    appId: "1:690798254228:web:99b19a23c64fe203cabc81"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);