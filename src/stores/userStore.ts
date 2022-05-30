import { makeAutoObservable, runInAction } from "mobx"
import { makePersistable } from "mobx-persist-store"
import { RootStore } from "./index"
import User from "../model/User"
import { ROLES } from "../constants/roles"
import sortArray from "sort-array"

/**
 * UserStore for all logged in user data
 */
class userStore {
  currentUser: User | undefined
  currentUserId: string | undefined
  leaderboardUsers: User[] | undefined
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.currentUser = undefined
    this.currentUserId = undefined
    this.leaderboardUsers = undefined

    makeAutoObservable(this)
    makePersistable(this, {
      name: "UserStore",
      properties: ["currentUserId", "currentUser"],
      storage: window.localStorage,
    }).then((test) => {
      //plain to class conversion
      runInAction(() => {
        this.currentUser = User.CreateFromPlain(this.currentUser)
      })
    })
  }

  // *** GETTER / SETTER ***
  setCurrentUserId(id: string): void {
    this.currentUserId = id
  }

  getCurrentUserId(): string {
    return this.currentUserId || ""
  }

  setCurrentUser(user: User): void {
    this.currentUser = user
  }

  getCurrentUser(): User | undefined {
    return this.currentUser
  }

  setLeaderboardUsers(leaderboardUsers: User[]) {
    this.leaderboardUsers = leaderboardUsers
  }

  getLeaderboardUsers(): User[] | undefined {
    return this.leaderboardUsers
  }

  /**
   * Reset the state of the store
   */
  reset() {
    this.currentUser = undefined
    this.currentUserId = undefined
    this.leaderboardUsers = undefined
  }

  /**
   * Add User to Store
   * @param user
   */
  async addUser(firstname: string, lastname: string, email: string, role: ROLES) {
    const user = await User.New(firstname, lastname, email, role)
    this.setCurrentUserId(user.userId)
    this.setCurrentUser(user)
  }

  /**
   * Get User from backend
   * @param email
   */
  async pullUser(email: string) {
    const user = await User.GetUser(email)
    this.setCurrentUserId(user.userId)
    this.setCurrentUser(user)
  }

  /**
   * Get all Users from backend
   */
  async pullLeaderboardUsers() {
    let leaderboardUsers = await User.GetAllPlayers()
    //nach Gesamtsumme (absteigend), Level (absteigend) und Anzahl Spiele (aufsteigend).

    leaderboardUsers = sortArray(leaderboardUsers, {
      by: ["points", "level", "gamesPlayedCount"],
      order: ["desc", "desc", "asc"],
    })
    this.setLeaderboardUsers(leaderboardUsers)
  }
}

export default userStore
