import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
} from "firebase/auth"
import { runInAction, makeAutoObservable } from "mobx"
import { ROLES } from "../constants/roles"
import userStore from "./userStore"
import { RootStore } from "./index"
import { FbAuth } from "../storage/firebase"

/**
 * AuthStore for all user authentication functionalities
 */
class AuthStore {
  rootStore: RootStore
  authUser: any

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.authUser = null
    makeAutoObservable(this)

    // listen to user changes (login, logout)
    onAuthStateChanged(FbAuth, (user) => {
      //because async, it needs to run in action
      runInAction(() => {
        this.authUser = user
      })
    })
  }

  /**
   * Creates a new user with email and password
   * @param firstname
   * @param lastname
   * @param email
   * @param password
   * @param isTeacher
   * @returns Promise<void>
   */
  doCreateUserWithEmailAndPassword(firstname: string, lastname: string, email: string, password: string, isTeacher: boolean) {
    return createUserWithEmailAndPassword(FbAuth, email.toLowerCase(), password)
      .then(() => {
        const userStore: userStore = this.rootStore.userStore
        //add to store
        const role: ROLES = isTeacher ? ROLES.TEACHER : ROLES.STUDENT
        userStore.addUser(firstname, lastname, email, role)
      })
      .catch((error) => {
        console.error("Error Create User", error)
      })
  }

  /**
   * Logs in a user with email and password
   * @param email
   * @param password
   * @returns Promise<UserCredential>
   */
  doSignInWithEmailAndPassword(email: string, password: string) {
    return signInWithEmailAndPassword(FbAuth, email.toLowerCase(), password)
      .then((authUser) => {
        const userStore = this.rootStore.userStore
        userStore.pullUser(email.toLowerCase())
        return authUser
      })
      .catch((error) => {
        console.error("Error Sign-In User", error)
      })
  }

  /**
   * Loggs a user out
   * @returns Promise<void>
   */
  doSignOut() {
    this.rootStore.userStore.reset()
    return signOut(FbAuth)
  }

  /**
   * Sets a new password for the logged in user
   * @param password
   * @returns Promise<void>
   */
  doUpdatePassword(password: string) {
    return updatePassword(this.authUser, password)
  }

  /**
   * Checks if a user is correctly authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !(this.authUser == null)
  }
}

export default AuthStore
