/* Implements all auth related functions */

import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

import { app } from "./config";

const auth = getAuth(app);

// Allows users to sign up
export async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    return userCredential.user;
}

//Allows users to log in
export async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return userCredential.user;
}

// Allows users to log out
export async function logout() {
    await signOut(auth);
}