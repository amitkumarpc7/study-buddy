import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../firebaseconfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";

interface AppUser {
  id: string;
  email: string;
  name: string;
}

export const FirebaseService = {
  signUp: async (
    email: string,
    password: string,
    name: string
  ): Promise<AppUser> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        createdAt: new Date().toISOString(),
      });

      return { id: user.uid, email: user.email || email, name };
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || "An error occurred");
    }
  },

  signIn: async (email: string, password: string): Promise<AppUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("User data not found");
      }

      const userData = userDoc.data();
      return { id: user.uid, email: user.email || email, name: userData.name };
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || "An error occurred");
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || "An error occurred");
    }
  },

  // Add listener for auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return auth.onAuthStateChanged(callback);
  },
};
