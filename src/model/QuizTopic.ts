import { makeAutoObservable } from "mobx"
import { QuizTopicsCollection, QuizTopicsDocRef } from "../constants/firebase"
import { FbDb } from "../storage/firebase"
import { getDocs, addDoc, setDoc, query, where } from "firebase/firestore"
import { classToPlain } from "class-transformer"
import Quiz from "./../model/Quiz"

/**
 * The QuizTopic object is used to store informations of a topic generated by a user (teacher)
 */
export default class QuizTopic {
  quizTopicId: string
  createdBy: string
  createdByName: string
  name: string
  isActive: boolean

  constructor(quizTopicId: string, createdBy: string, name: string, createdByName: string, isActive: boolean) {
    this.quizTopicId = quizTopicId
    this.createdBy = createdBy
    this.createdByName = createdByName
    this.name = name
    this.isActive = isActive

    makeAutoObservable(this)
  }

  private static Empty() {
    return new QuizTopic("", "", "", "", true)
  }

  /**
   * Convert plain JS Object to QuizTOpic class Object
   * @param obj
   * @returns QuizTopic
   */
  private static CreateFromPlain(obj: any): QuizTopic {
    const quizTopic = QuizTopic.Empty()
    return Object.assign(quizTopic, obj)
  }

  /**
   * Add new quiz topic to database
   * @param createdBy string
   * @param name string
   * @param createdByName string
   * @returns Promise<QuizTopic>
   */
  static async New(createdBy: string, name: string, createdByName: string, isActive: boolean) {
    const quizTopic = { createdBy, name, quizTopicId: "", createdByName }
    try {
      //create new emtpy doc
      const quizTopicDocRef = await addDoc(QuizTopicsCollection(FbDb), {})
      // set key as unique id
      quizTopic.quizTopicId = quizTopicDocRef.id
      // update with userId
      await setDoc(quizTopicDocRef, quizTopic)
    } catch (error) {
      console.error("Error Adding QuizTopic: ", error)
    }
    return QuizTopic.CreateFromPlain(quizTopic)
  }

  /**
   * Update the quiz topic in the database
   * @returns Promise<void>
   */
  async update() {
    const quizTopic = classToPlain(this)
    const quizTopicDocRef = QuizTopicsDocRef(FbDb, this.quizTopicId)
    await setDoc(quizTopicDocRef, quizTopic)
  }

  /**
   * Get all Quiz Topics from database
   * @returns Promise<QuizTopic[]>
   */
  static async GetAll() {
    const allQuizTopics: QuizTopic[] = []
    const querySnapshot = await getDocs(QuizTopicsCollection(FbDb))
    querySnapshot.forEach((doc) => {
      const quizTopic = QuizTopic.CreateFromPlain(doc.data())
      allQuizTopics.push(quizTopic)
    })
    return allQuizTopics
  }

  /**
   * Get all Quiz Topics from database filtered by a list of Ids
   * @param quizTopicIds
   * @returns Promise<QuizTopic[]>
   */
  static async GetMany(quizTopicIds: string[]) {
    if (!quizTopicIds || quizTopicIds.length === 0) return []
    const filteredQuizTopics: QuizTopic[] = []
    const q = query(QuizTopicsCollection(FbDb), where("quizTopicId", "in", quizTopicIds))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const quizTopic = QuizTopic.CreateFromPlain(doc.data())
      filteredQuizTopics.push(quizTopic)
    })
    return filteredQuizTopics
  }

  /**
   * Get all Quiz Topics of specific user from database
   * @param userId
   * @returns Promise<QuizTopic[]>
   */
  static async GetAllOfUser(userId: string) {
    const allQuizTopics: QuizTopic[] = []
    const q = query(QuizTopicsCollection(FbDb), where("createdBy", "==", userId))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const quizTopic = QuizTopic.CreateFromPlain(doc.data())
      allQuizTopics.push(quizTopic)
    })
    return allQuizTopics
  }

  /**
   * Get the corresponding quiz for the topic
   * @returns Promise<Quiz>
   */
  async getQuiz() {
    const quiz = await Quiz.GetByTopic(this.quizTopicId)
    return quiz
  }
}
