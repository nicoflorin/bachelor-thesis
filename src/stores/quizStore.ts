import { makeAutoObservable, runInAction } from "mobx"
import { RootStore } from "./index"
import QuizTopic from "./../model/QuizTopic"
import Quiz from "./../model/Quiz"

/**
 * QuizStore for all QuizTopic and Quiz related data
 */
class QuizStore {
  rootStore: RootStore
  allQuizTopics: QuizTopic[]
  newQuizTopic: QuizTopic | undefined
  newQuiz: Quiz | undefined
  searchQuizTopics: QuizTopic[]
  completedQuizTopics: QuizTopic[]

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.allQuizTopics = []
    this.searchQuizTopics = []
    this.completedQuizTopics = []
    makeAutoObservable(this)
  }

  // ** GETTER / SETTER ** //
  getAllQuizTopics(): QuizTopic[] {
    return this.allQuizTopics
  }

  getCompletedQuizTopics(): QuizTopic[] {
    return this.completedQuizTopics
  }

  setNewQuizTopic(quizTopicName: string): void {
    const createdByUserId = this.rootStore.userStore.getCurrentUserId()
    const createdByName = this.rootStore.userStore.getCurrentUser()?.getName() || ""
    QuizTopic.New(createdByUserId, quizTopicName, createdByName, true).then((quizTopic) => {
      runInAction(() => {
        this.newQuizTopic = quizTopic
      })
      Quiz.New(quizTopic.quizTopicId).then((quiz) => {
        runInAction(() => {
          this.newQuiz = quiz
        })
      })
    })
  }

  setEditQuizTopic(quizTopic: QuizTopic, quiz: Quiz): void {
    this.newQuizTopic = quizTopic
    this.newQuiz = quiz
  }

  getNewQuizTopic(): QuizTopic | undefined {
    return this.newQuizTopic
  }

  getNewQuiz(): Quiz | undefined {
    return this.newQuiz
  }

  addNewQuizQuestion(): void {
    this.newQuiz?.addNewQuestion()
  }

  setNewQuizQuestionText(index: number, text: string): void {
    if (!this.newQuiz) return
    this.newQuiz.questions[index].text = text
  }

  setNewQuizQuestionCorrectAnswer(index: number, text: string): void {
    if (!this.newQuiz) return
    this.newQuiz.questions[index].correctAnswer = text
  }

  setNewQuizQuestionWrongAnswer1(index: number, text: string): void {
    if (!this.newQuiz) return
    this.newQuiz.questions[index].wrongAnswer1 = text
  }

  setNewQuizQuestionWrongAnswer2(index: number, text: string): void {
    if (!this.newQuiz) return
    this.newQuiz.questions[index].wrongAnswer2 = text
  }

  setNewQuizQuestionWrongAnswer3(index: number, text: string): void {
    if (!this.newQuiz) return
    this.newQuiz.questions[index].wrongAnswer3 = text
  }

  setNewQuizQuestionImageUrl(index: number, text: string): void {
    if (!this.newQuiz) return
    this.newQuiz.questions[index].imageUrl = text
  }

  getSearchQuizTopics(): QuizTopic[] {
    return this.searchQuizTopics
  }

  deleteNewQuizQuestion(index: number) {
    this.newQuiz?.questions.splice(index, 1)
  }

  /**
   * Reset the New QuizTopic and Quiz
   */
  reset() {
    this.newQuizTopic = undefined
    this.newQuiz = undefined
  }

  /**
   * Submit the Quiz Topic Edit form (save topic and quiz)
   * @returns Promise<void>
   */
  async submitQuizTopicForm() {
    if (!this.newQuizTopic) return
    if (!this.newQuiz) return

    //for completely new topic
    if (!this.newQuizTopic.quizTopicId) {
      const createdByName = this.rootStore.userStore.getCurrentUser()?.getName() || ""
      await QuizTopic.New(this.newQuizTopic.createdBy, this.newQuizTopic.name, createdByName, this.newQuizTopic.isActive)
    } else {
      await this.newQuizTopic.update()
    }

    //for completely new quiz
    if (!this.newQuiz.quizId) {
      await Quiz.New(this.newQuizTopic.quizTopicId)
    } else {
      await this.newQuiz.update()
    }

    runInAction(() => {
      if (this.newQuizTopic) {
        this.allQuizTopics.push(this.newQuizTopic)
        this.reset()
      }
    })
  }

  /**
   * Empties Member Arrays
   */
  emptyQuizTopics(): void {
    this.allQuizTopics = []
    this.searchQuizTopics = []
  }

  /**
   * Get all quizTopics
   */
  async pullAllQuizTopics() {
    this.allQuizTopics = []
    const allQuizTopics = await QuizTopic.GetAll()
    runInAction(() => {
      this.allQuizTopics = [...allQuizTopics]
      this.searchQuizTopics = [...allQuizTopics]
    })
  }

  /**
   * Get all quizTopics of logged in user
   */
  async pullAllQuizTopicsOfUser() {
    this.allQuizTopics = []
    const currentUserId: string = this.rootStore.userStore.getCurrentUserId()
    const allQuizTopicsOfUser = await QuizTopic.GetAllOfUser(currentUserId)
    this.emptyQuizTopics()
    runInAction(() => {
      this.allQuizTopics = [...allQuizTopicsOfUser]
    })
  }

  /**
   * Get all completed quizTopics of logged in user
   */
  async pullAllCompletedQuizTopicsOfUser() {
    this.allQuizTopics = []
    const currentUser = this.rootStore.userStore.getCurrentUser()
    if (!currentUser) return
    const allCompletedQuizTopicsOfUser = await QuizTopic.GetMany(currentUser?.completedQuizTopics)
    runInAction(() => {
      this.completedQuizTopics = [...allCompletedQuizTopicsOfUser]
    })
  }

  /**
   * Pull a quiz and edit it
   * @param quizTopic
   */
  async editQuizTopic(quizTopic: QuizTopic) {
    this.reset()
    const quiz: Quiz = await this.getQuizForTopic(quizTopic)
    this.setEditQuizTopic(quizTopic, quiz)
  }

  /**
   * filter the quiz topic list by a given name
   * @param name Text to filter quiz topics by
   * @returns Promise<void>
   */
  filterAllQuizTopicsByName(name: string): void {
    if (!this.allQuizTopics) return
    if (!name) this.searchQuizTopics = [...this.allQuizTopics]

    this.searchQuizTopics = this.allQuizTopics.filter((quizTopic) => {
      return quizTopic.name.toLowerCase().includes(name.toLowerCase())
    })
  }

  /**
   * Returns the quiz for a quiz topic
   * @param quizTopic QuizTopic
   * @returns Promise<Quiz>
   */
  async getQuizForTopic(quizTopic: QuizTopic): Promise<Quiz> {
    const quiz = await quizTopic.getQuiz()
    return quiz
  }

  /**
   * checks if quizTopic is already completed by user
   * @param quizTopic QuizTopic
   * @returns boolean
   */
  isQuizTopicCompleted(quizTopic: QuizTopic): boolean {
    const currentUser = this.rootStore.userStore.getCurrentUser()
    return currentUser?.completedQuizTopics.indexOf(quizTopic.quizTopicId) !== -1
  }
}
export default QuizStore
