import { initializeApp, FirebaseApp } from "firebase/app"
import { getFirestore, Firestore } from "firebase/firestore"
import { getAuth, Auth } from "firebase/auth"
import { getStorage, FirebaseStorage } from "firebase/storage"

/**
 * Firebase Config variables
 */
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
}

const FbApp: FirebaseApp = initializeApp(config)
const FbDb: Firestore = getFirestore()
const FbAuth: Auth = getAuth(FbApp)
const FbStorage: FirebaseStorage = getStorage(FbApp)

export { FbApp, FbDb, FbAuth, FbStorage }
