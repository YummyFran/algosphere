import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMrfFt7tunq4UynU0PbWRoc9scmeo8oyA",
    authDomain: "algosphere-16283.firebaseapp.com",
    projectId: "algosphere-16283",
    storageBucket: "algosphere-16283.appspot.com",
    messagingSenderId: "504801502744",
    appId: "1:504801502744:web:9eaa0fdddebb4bc4ff856d",
    measurementId: "G-MW5S2JX9Q3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);




