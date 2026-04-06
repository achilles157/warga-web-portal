import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

export interface UserProfile {
    uid: string;
    email?: string; // Optional because we don't save it to public profile anymore
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
            last_login_at: serverTimestamp(),
            ...overrides,
            // Ensure required fields are defined and not overwritten by undefined in overrides
            display_name: overrides?.display_name || user.displayName || "Warga Baru",
            email: overrides?.email || user.email || "",
            photo_url: overrides?.photo_url || user.photoURL || "",
            role: overrides?.role || "contributor",
        };
        await setDoc(userRef, newUser);
        return newUser;
    } else {
        // Existing User -> Update last login
        await updateDoc(userRef, {
            last_login_at: serverTimestamp(),
            // Coba perbarui email di database jika di provider ada dan sebelumnya belum punya
            ...(user.email ? { email: user.email } : {}),
            ...overrides,
        });
        return { ...userSnap.data(), email: user.email || userSnap.data().email, ...overrides } as UserProfile;
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

/**
 * Fetches all emails of users with role 'admin' or 'staff'.
 */
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getAdminsAndStaffEmails(): Promise<string[]> {
    const usersRef = collection(db, USERS_COLLECTION);
    const qAdmin = query(usersRef, where("role", "==", "admin"));
    const qStaff = query(usersRef, where("role", "==", "staff"));
    
    const [adminSnaps, staffSnaps] = await Promise.all([
        getDocs(qAdmin),
        getDocs(qStaff)
    ]);
    
    const emails: string[] = [];
    
    adminSnaps.forEach(doc => {
        const data = doc.data() as UserProfile;
        if (data.email) emails.push(data.email);
    });
    
    staffSnaps.forEach(doc => {
        const data = doc.data() as UserProfile;
        if (data.email) emails.push(data.email);
    });
    
    // Remove duplicates just in case
    return Array.from(new Set(emails));
}
