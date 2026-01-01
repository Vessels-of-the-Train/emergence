import { signInAnonymously, Auth } from 'firebase/auth';

export async function initiateAnonymousSignIn(auth: Auth) {
    try {
        const result = await signInAnonymously(auth);
        console.log("Signed in anonymously", result.user.uid);
        return result.user;
    } catch (error) {
        console.error("Error signing in anonymously", error);
        throw error;
    }
}
