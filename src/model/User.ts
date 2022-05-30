import { makeAutoObservable } from "mobx"
import { ROLES } from "../constants/roles"
import { addDoc, setDoc, getDocs, query, where } from "firebase/firestore"
import { UserCollection, UserDocRef } from "../constants/firebase"
import { FbDb } from "../storage/firebase"
import { classToPlain } from "class-transformer"
import { JOKER, jokers } from "../constants/game"
import { BADGES, BadgeType } from "../constants/badges"
import { find, union } from "lodash"
import { nextLevelPoints, LEVEL_OFFSET } from "../constants/game"

interface UserJoker {
  type: JOKER
  count: number
}

let DEFAULT_JOKERS: UserJoker[] = []
jokers.forEach((joker) => {
  DEFAULT_JOKERS.push({ type: joker.type, count: joker.count })
})

/**
 * The User object holds all informations of a user (both student and teacher)
 */
export default class User {
  userId: string
  firstname: string
  lastname: string
  email: string
  role: ROLES
  level: number
  points: number
  gamesPlayedCount: number
  jokers: UserJoker[]
  badges: BADGES[]
  completedQuizTopics: string[]

  constructor(
    userId: string,
    firstname: string,
    lastname: string,
    email: string,
    role: ROLES,
    level: number,
    points: number,
    gamesPlayedCount: number,
    jokers: UserJoker[],
    badges: BADGES[],
    completedQuizTopics: string[]
  ) {
    this.userId = userId
    this.firstname = firstname
    this.lastname = lastname
    this.email = email
    this.role = role
    this.level = level
    this.points = points
    this.gamesPlayedCount = gamesPlayedCount
    this.jokers = jokers
    this.badges = badges
    this.completedQuizTopics = completedQuizTopics
    makeAutoObservable(this)
  }

  private static Empty() {
    return new User("", "", "", "", ROLES.STUDENT, 0, 0, 0, DEFAULT_JOKERS, [], [])
  }

  /**
   * Convert plain JS Object to User class Object
   * @param obj
   * @returns User
   */
  static CreateFromPlain(obj: any): User {
    const user = User.Empty()
    return Object.assign(user, obj)
  }

  /* GETTER / SETTER  */

  getName() {
    return `${this.firstname} ${this.lastname}`
  }

  getJokerCount(type: JOKER): number {
    //set default if not initialized
    if (this.jokers.length === 0) this.jokers = DEFAULT_JOKERS
    const foundJoker: UserJoker | undefined = find(this.jokers, ["type", type])
    return foundJoker?.count || 0
  }

  /**
   * Creates a new User object and saves it in the DB
   * @param firstname
   * @param lastname
   * @param email
   * @param role
   * @returns Promise<User>
   */
  static async New(firstname: string, lastname: string, email: string, role: ROLES) {
    const user = User.Empty()
    user.firstname = firstname
    user.lastname = lastname
    user.email = email
    user.role = role
    try {
      //create new emtpy doc
      const userDocRef = await addDoc(UserCollection(FbDb), {})
      // set key as unique id
      user.userId = userDocRef.id
      // update with userId
      await setDoc(userDocRef, classToPlain(user))
    } catch (error) {
      console.error("Error Adding User: ", error)
    }

    return user
  }

  /**
   * Gets a User from the database based on the email
   * @param email
   * @returns Promise<User>
   */
  static async GetUser(email: string) {
    let user: User = User.Empty()
    try {
      const q = query(UserCollection(FbDb), where("email", "==", email))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        throw Error(`ERROR, no user found with email ${email}`)
      }
      querySnapshot.forEach((doc) => {
        user = User.CreateFromPlain(doc.data())
      })
    } catch (e) {
      throw Error(`ERROR, Unable to pull user with email ${email}`)
    }

    return user
  }

  /**
   * Update the user in the database
   * @returns Promise<void>
   */
  async Update() {
    const user = classToPlain(this)
    const userDocRef = UserDocRef(FbDb, this.userId)
    await setDoc(userDocRef, user)
  }

  /**
   * Get all users from database
   * @returns Promise<User[]>
   */
  static async GetAll() {
    const allUsers: User[] = []
    const querySnapshot = await getDocs(UserCollection(FbDb))
    querySnapshot.forEach((doc) => {
      const user = User.CreateFromPlain(doc.data())
      allUsers.push(user)
    })
    return allUsers
  }

  /**
   * Get all player users from database
   * @returns Promise<User[]>
   */
  static async GetAllPlayers() {
    const allUsers: User[] = []
    const q = query(UserCollection(FbDb), where("role", "==", ROLES.STUDENT))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const user = User.CreateFromPlain(doc.data())
      allUsers.push(user)
    })
    return allUsers
  }

  /**
   * Add points to user
   * @param points
   */
  addPoints(points: number): void {
    this.points += points
  }

  /**
   * Increase player level, if necessary
   */
  updateLevel(): void {
    this.level = Math.floor(this.points / 1000000)
  }

  /**
   * Increase games player counter
   */
  increaseGamesPlayedCount(): void {
    this.gamesPlayedCount += 1
  }

  /**
   * Task for when a joker is used
   * @param type JOKER
   * @returns  void
   */
  useJoker(type: JOKER): void {
    const foundJoker: UserJoker | undefined = find(this.jokers, ["type", type])
    if (!foundJoker) return
    //decrease count of specific joker
    if (foundJoker.count > 0) {
      foundJoker.count -= 1
    }
  }

  /**
   * User reached a new level:
   * - add new jokers
   */
  levelUp(): void {
    this.jokers.forEach((joker) => {
      joker.count += 1
    })
  }

  /**
   * Add Badge uniquely to users won badges
   * @param badge BADGE
   */
  addBadge(badge: BadgeType) {
    this.badges = union(this.badges, [badge.type])
  }

  /**
   * Add a list of won badges to user
   * @param badges BADGE[]
   */
  addBadges(badges: BadgeType[]) {
    badges.forEach((badge) => {
      this.addBadge(badge)
    })
  }

  /**
   * Calculates the progress of the current Level (0-100%)
   * @returns number
   */
  getLevelProgress(): number {
    return ((this.points % LEVEL_OFFSET) / LEVEL_OFFSET) * 100
  }

  /**
   * Gets the needed points for the next level
   * @returns number
   */
  getNextLevelPoints(): number {
    return nextLevelPoints(this.level)
  }

  /**
   * Add QuizTopicId to completed list of quizTopics
   * @param quizTopicId string
   */
  addCompletedQuizTopic(quizTopicId: string) {
    this.completedQuizTopics = union(this.completedQuizTopics, [quizTopicId])
  }
}
