import { makeAutoObservable } from "mobx"
import { getDocs, addDoc, setDoc, query, where } from "firebase/firestore"
import { QuizCollection, QuizDocRef } from "../constants/firebase"
import { FbDb } from "../storage/firebase"
import { classToPlain } from "class-transformer"

export interface Question {
  text: string
  correctAnswer: string
  wrongAnswer1: string
  wrongAnswer2: string
  wrongAnswer3: string
  imageUrl: string
}

const questionTemplate: Question = {
  text: "",
  correctAnswer: "",
  wrongAnswer1: "",
  wrongAnswer2: "",
  wrongAnswer3: "",
  imageUrl: "",
}

/**
 * The Quiz object is used to hold the question/answer informationes of a Quiz Topic
 */
export default class Quiz {
  quizId: string
  quizTopicId: string
  questions: Question[]

  constructor(quizId: string, quizTopicId: string, questions: Question[]) {
    this.quizId = quizId
    this.quizTopicId = quizTopicId
    this.questions = questions

    makeAutoObservable(this)
  }

  private static Empty() {
    return new Quiz("", "", [])
  }

  /**
   * Convert plain JS Object to Quiz class Object
   * @param obj
   * @returns Quiz
   */
  static CreateFromPlain(obj: any): Quiz {
    const quiz = Quiz.Empty()
    return Object.assign(quiz, obj)
  }

  /**
   * Add new quiz to database
   * @param quizTopicId
   * @returns Promise<QuizTopic>
   */
  static async New(quizTopicId: string) {
    const questions: Question[] = [] //first dummy question
    questions.push(questionTemplate)
    const quiz = { quizTopicId, quizId: "", questions }
    try {
      //create new emtpy doc
      const quizDocRef = await addDoc(QuizCollection(FbDb), {})
      // set key as unique id
      quiz.quizId = quizDocRef.id
      // update with userId
      await setDoc(quizDocRef, quiz)
    } catch (error) {
      console.error("Error Adding Quiz: ", error)
    }
    return Quiz.CreateFromPlain(quiz)
  }

  /**
   * Update the quiz in the database
   * @returns Promise<void>
   */
  async update() {
    const quiz = classToPlain(this)
    const quizDocRef = QuizDocRef(FbDb, this.quizId)
    await setDoc(quizDocRef, quiz)
  }

  /**
   * Get a quiz by its topic id
   * @param quizTopicId
   * @returns Promise<Quiz>
   */
  static async GetByTopic(quizTopicId: string) {
    let quiz = Quiz.Empty()

    try {
      const q = query(QuizCollection(FbDb), where("quizTopicId", "==", quizTopicId))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        quiz = Quiz.CreateFromPlain(doc.data())
      })
    } catch (e) {
      console.log("Unable to pull quiz")
    }
    return quiz
  }

  addNewQuestion() {
    this.questions.push(questionTemplate)
  }
}
