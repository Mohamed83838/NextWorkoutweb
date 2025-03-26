import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth }  from "../lib/firebase";


// Sign in with Google
export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        console.log('Signing in with Google...');
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('User signed in:', user);
        return user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
}