import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parseFirestoreTimestamp(timestamp: any): Date | null {
    if (!timestamp) return null;

    // If it's already a Date object
    if (timestamp instanceof Date) return timestamp;

    // If it's a Firestore Timestamp (has toDate method)
    if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate();
    }

    // If it's a serialized Timestamp (seconds, nanoseconds)
    if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
        return new Date(timestamp.seconds * 1000);
    }

    // If it's a string or number
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) return date;

    return null;
}
