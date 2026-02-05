import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

export interface UserProfile {
    uid: string;
    email: string;
    display_name: string;
    photo_url: string;
    role: "admin" | "staff" | "contributor";
    bio?: string;
    created_at?: any;
    last_login_at?: any;
}

const USERS_COLLECTION = "users_collection";

/**
 * Syncs the Firebase Auth user with the Firestore user document.
 * Creates the document if it doesn't exist.
 */
export async function syncUser(user: FirebaseUser, overrides?: Partial<UserProfile>): Promise<UserProfile> {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // New User -> Default role is 'contributor'
        const newUser: UserProfile = {
            uid: user.uid,
            email: user.email || "",
            display_name: overrides?.display_name || user.displayName || "Warga Baru",
            photo_url: user.photoURL || "",
            role: "contributor",
            bio: "",
            created_at: serverTimestamp(),
            last_login_at: serverTimestamp(),
            ...overrides,
        };
        await setDoc(userRef, newUser);
        return newUser;
    } else {
        // Existing User -> Update last login
        await updateDoc(userRef, {
            last_login_at: serverTimestamp(),
            ...overrides,
        });
        return { ...userSnap.data(), ...overrides } as UserProfile;
    }
}

/**
 * Fetches a user profile by ID (Public).
 */
export async function getUserById(uid: string) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }
    return null;
}
