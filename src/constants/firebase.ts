import { collection, Firestore, doc } from "firebase/firestore"

/**
 * USER COLLECTION
 */
const USER_REF: string = "users"
export const UserCollection = (db: Firestore) => collection(db, USER_REF)
export const UserDocRef = (db: Firestore, docRef: string) => doc(db, USER_REF, docRef)

/**
 * QUIZ AND QUIZ TOPIC COLLECTION
 */
const QUIZ_TOPICS_REF: string = "quiz_topics"
const QUIZ_REF: string = "quizzes"
export const QuizTopicsCollection = (db: Firestore) => collection(db, QUIZ_TOPICS_REF)
export const QuizCollection = (db: Firestore) => collection(db, QUIZ_REF)
export const QuizTopicsDocRef = (db: Firestore, docRef: string) => doc(db, QUIZ_TOPICS_REF, docRef)
export const QuizDocRef = (db: Firestore, docRef: string) => doc(db, QUIZ_REF, docRef)

/**
 * FIREBASE ERROR CODES
 */
export const FIREBASE_ERRORS: { [key: string]: string } = {
  "auth/user-not-found": "User not found",
  "auth/email-already-in-use": "Email already in use",
  "auth/weak-password": "Password needs to be at least 6 characters long",
  "auth/wrong-password": "Wrong Password",
  "auth/invalid-email": "Invalid Email",
}
