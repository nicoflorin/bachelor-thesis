import { makeAutoObservable, runInAction } from "mobx"
import Quiz, { Question } from "../model/Quiz"
import QuizTopic from "./../model/QuizTopic"
import { RootStore } from "./index"
import * as GAME_CONSTANTS from "../constants/game"
import { questionLevelToPoint, JokerType, JOKER } from "../constants/game"
import { shuffle, pullAt, sampleSize } from "lodash"
import { BadgeType, getBadge, BADGES } from "../constants/badges"

export interface ActiveAnswer {
  text: string
  isCorrect: boolean
}

export interface ActiveQuestion {
  level: number
  points: number
  done: boolean
  active: boolean
  question: string
  isSecure: boolean
  answers: ActiveAnswer[]
  imageUrl: string | undefined
}

interface ActiveQuiz {
  questions: ActiveQuestion[]
  gameOver: boolean
  earnedPoints: number
  quizTopicId: string
}

const activeQuizTemplate: ActiveQuiz = {
  questions: [],
  gameOver: false,
  earnedPoints: 0,
  quizTopicId: "",
}

/**
 * GameStore for all game data during playing
 */
class GameStore {
  rootStore: RootStore
  activeQuiz: ActiveQuiz
  activeQuestionIdx: number
  secondsRemaining: number
  timerId: NodeJS.Timer | undefined
  jokers: JokerType[]
  hasLevelUp: boolean
  hasWonGame: boolean
  jokerUsed: boolean
  secondsElapsed: number
  wonBadges: BadgeType[]

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.activeQuiz = activeQuizTemplate
    this.activeQuestionIdx = 0
    this.secondsRemaining = GAME_CONSTANTS.SECONDS_PER_QUESTION
    this.jokers = GAME_CONSTANTS.jokers
    this.hasLevelUp = false
    this.hasWonGame = false
    this.jokerUsed = false
    this.secondsElapsed = 0
    this.wonBadges = []
    makeAutoObservable(this)
  }

  // ** GETTER / SETTER **
  setActiveQuiz(quiz: Quiz): void {
    this.activeQuiz = this.convertQuizToActiveQuiz(quiz)
  }

  getActiveQuiz(): ActiveQuiz {
    return this.activeQuiz
  }

  getActiveQuestion(): ActiveQuestion | undefined {
    return this.activeQuiz.questions.find((question) => {
      return question.active === true
    })
  }

  getSecondsRemaining(): number {
    return this.secondsRemaining
  }

  getJokers() {
    return this.jokers
  }

  getGameOver() {
    return this.activeQuiz.gameOver
  }

  getHasLevelUp() {
    return this.hasLevelUp
  }

  getWonBadges() {
    return this.wonBadges
  }

  private setGameOver() {
    this.activeQuiz.gameOver = true
  }

  private setActiveQuestionDone() {
    const activeQuestion = this.getActiveQuestion()
    if (!activeQuestion) return
    activeQuestion.done = true
  }

  private setActiveQuestionActive(active: boolean) {
    const activeQuestion = this.getActiveQuestion()
    if (!activeQuestion) return
    activeQuestion.active = active
  }

  /**
   * Get count of questions in active quiz
   * @returns number
   */
  getQuestionCount() {
    if (this.activeQuiz) return this.activeQuiz?.questions.length
    else return 0
  }

  /**
   * Get the total points a player has achieved (minus points not included)
   * @returns number
   */
  getTotalPoints() {
    return this.activeQuiz.earnedPoints
  }

  /**
   * Get the total points a player has achieved. Minus possible malus points
   * @returns number
   */
  getEarnedPoints() {
    let earnedPoints = this.activeQuiz.earnedPoints - this.getMinusPoints()
    if (earnedPoints < 0) earnedPoints = 0
    return earnedPoints
  }

  /**
   * Calculates the minus points and returns them
   * @returns number
   */
  getMinusPoints() {
    let minusPoints = 0
    if (this.jokerUsed) {
      minusPoints = Math.round(this.activeQuiz.earnedPoints / 4)
    }
    return minusPoints
  }

  /**
   * Set the Quiz Topic as active
   * @param quizTopic
   */
  setActiveQuizTopic(quizTopic: QuizTopic): void {
    this.rootStore.quizStore
      .getQuizForTopic(quizTopic)
      .then((quiz) => {
        this.setActiveQuiz(quiz)
      })
      .catch(() => console.log("Error: Could not set active quiz"))
  }

  /**
   * Converts a Question of Type Question to Type ActiveQuestion
   * @param question
   * @returns ActiveQuestion
   */
  private convertQuestionToActiveQuestion(question: Question, level: number, active: boolean, isSecure: boolean): ActiveQuestion {
    const activeQuestion: ActiveQuestion = {
      question: question.text,
      done: false,
      active: active,
      level: level,
      isSecure: isSecure,
      points: questionLevelToPoint(level),
      answers: shuffle([
        { text: question.correctAnswer, isCorrect: true },
        { text: question.wrongAnswer1, isCorrect: false },
        { text: question.wrongAnswer2, isCorrect: false },
        { text: question.wrongAnswer3, isCorrect: false },
      ]),
      imageUrl: question.imageUrl,
    }
    return activeQuestion
  }

  /**
   * Converts a Quiz of Type Quiz to Type ActiveQuiz
   * @param quiz
   * @returns ActiveQuiz
   */
  private convertQuizToActiveQuiz(quiz: Quiz): ActiveQuiz {
    const activeQuiz: ActiveQuiz = {
      questions: [],
      gameOver: false,
      earnedPoints: 0,
      quizTopicId: quiz.quizTopicId,
    }
    shuffle(quiz.questions).forEach((question, i) => {
      const level = i + 1
      const active = i === 0 ? true : false
      const isSecure = level % 5 === 0 //every 5th is secure
      activeQuiz.questions.push(this.convertQuestionToActiveQuestion(question, level, active, isSecure))
    })
    return activeQuiz
  }

  /**
   * Initialize before each game starts
   */
  private init() {
    this.timerId = undefined
    this.secondsRemaining = GAME_CONSTANTS.SECONDS_PER_QUESTION
    this.activeQuestionIdx = 0
    this.activeQuiz = activeQuizTemplate
    this.jokers = GAME_CONSTANTS.jokers
    this.hasLevelUp = false
    this.hasWonGame = false
    this.jokerUsed = false
    this.secondsElapsed = 0
    this.wonBadges = []
    this.initJokers()
  }

  /**
   * Load next question
   */
  private nextQuestion(): void {
    if (!this.activeQuiz) return
    // prevent out of bound
    if (this.getQuestionCount() === this.activeQuestionIdx + 1) return

    this.setActiveQuestionDone()
    this.setActiveQuestionActive(false)

    this.activeQuestionIdx++
    this.activeQuiz.questions[this.activeQuestionIdx].active = true
    this.resetTimer()

    //set jokers active
    this.jokers.forEach((joker) => (joker.used = false))
  }

  /**
   * Checks if game is over
   * @returns boolean
   */
  private chkGameOver(): boolean {
    return this.getQuestionCount() === this.activeQuestionIdx + 1
  }

  private wrongAnswerSelected(): void {
    this.endGame()
  }

  private correctAnswerSelected(): void {
    //save points if secure question level reached or last question was answered correctly
    if (this.getActiveQuestion()?.isSecure || this.chkGameOver()) {
      this.activeQuiz.earnedPoints = this.getActiveQuestion()?.points || 0
    }

    if (this.chkGameOver()) {
      this.hasWonGame = true
      this.endGame()
    } else {
      this.nextQuestion()
    }
  }

  /**
   * Handle the selection of an answer
   * @param answer
   */
  answerSelected(answer: ActiveAnswer) {
    if (answer.isCorrect) {
      this.correctAnswerSelected()
    } else {
      this.wrongAnswerSelected()
    }
  }

  /**
   * Starts the Timer for the current question
   */
  private startTimer(): void {
    this.secondsRemaining = GAME_CONSTANTS.SECONDS_PER_QUESTION
    const decrementSecondsRemaining = () => {
      if (this.secondsRemaining > 0) {
        runInAction(() => {
          this.secondsRemaining--
          this.secondsElapsed++
        })
      } else {
        this.endGame()
      }
    }
    this.timerId = setInterval(decrementSecondsRemaining, 1000)
  }

  /**
   * Stops the timer for the current question
   */
  endTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = undefined
    }
  }

  /**
   * Restarts the Timer (Stop/Start)
   */
  private resetTimer(): void {
    this.endTimer()
    this.startTimer()
  }

  /**
   * Starts the game with the given Quiz Topic
   * @param quizTopic QuizTopic
   */
  startGame(quizTopic: QuizTopic) {
    this.endTimer()
    this.init()
    this.setActiveQuizTopic(quizTopic)
    this.startTimer()
  }

  /**
   * Ends the active game
   */
  endGame() {
    this.endTimer()
    this.setActiveQuestionDone()
    this.setWonBadges()
    this.updateUser()
    this.setGameOver()
  }

  /**
   * Update user:
   * - add earned points
   * - check if level up
   * - update level if necessary
   * - calculate and add won badges
   */
  private updateUser(): void {
    const currentUser = this.rootStore.userStore.getCurrentUser()
    if (!currentUser) return
    currentUser.addPoints(this.getEarnedPoints())

    //check if level up
    const currentUserLevel = currentUser.level || 0
    currentUser.updateLevel()
    if (currentUser.level > currentUserLevel) {
      this.hasLevelUp = true
      currentUser.levelUp()
    }
    currentUser.increaseGamesPlayedCount()

    if (this.hasWonGame) {
      currentUser.addCompletedQuizTopic(this.activeQuiz.quizTopicId)
      currentUser.addBadges(this.wonBadges)
    }
    currentUser.Update()
  }

  /**
   * Method must run for all Jokers
   * @param joker
   */
  runForAllJoker(joker: JokerType): void {
    const currentUser = this.rootStore.userStore.getCurrentUser()
    if (!currentUser) return

    this.jokerUsed = true
    joker.used = true
    currentUser.useJoker(joker.type)
    joker.count -= 1
  }

  /**
   * Activation of 50:50 joker. Removes two wrong answers of the active question
   */
  run5050Joker(joker: JokerType): void {
    if (joker.count === 0) {
      return
    }
    const activeQuestion = this.getActiveQuestion()
    if (!activeQuestion) return

    this.runForAllJoker(joker)

    //search for idx of wrong answers
    const wrongAnswersIdx: number[] = []
    activeQuestion.answers.forEach((answer, i) => {
      if (!answer.isCorrect) wrongAnswersIdx.push(i)
    })
    const toRemove = sampleSize(wrongAnswersIdx, 2) // random pick of two wrong answers
    pullAt(activeQuestion.answers, toRemove) // remove the picked wrong answers
  }

  /**
   * Activation of Time Stop joker. Stop the timer for this question
   */
  runTimerStopJoker(joker: JokerType): void {
    if (joker.count === 0) {
      return
    }

    const currentUser = this.rootStore.userStore.getCurrentUser()
    if (!currentUser) return
    this.runForAllJoker(joker)

    this.endTimer()
  }

  /**
   * Initialization of Joker List
   */
  private initJokers() {
    this.jokers.forEach((joker) => {
      switch (joker.type) {
        case JOKER.JOKER_5050:
          joker.run = () => this.run5050Joker(joker)
          break
        case JOKER.JOKER_TIMER_STOP:
          joker.run = () => this.runTimerStopJoker(joker)
          break
      }
      // set count based on how many jokers user has
      joker.count = this.rootStore.userStore.getCurrentUser()?.getJokerCount(joker.type) || 0
    })
  }

  /**
   * checks which badges the user won and sets these badges in the store
   */
  private setWonBadges() {
    const wonBadges: BadgeType[] = []
    const currentUser = this.rootStore.userStore.getCurrentUser()
    if (!currentUser) return

    // Won Games Badges
    if (this.hasWonGame) {
      switch (currentUser.gamesPlayedCount) {
        case 1:
          wonBadges.push(getBadge(BADGES.BADGE_WON_GAME_1))
          break
        case 5:
          wonBadges.push(getBadge(BADGES.BADGE_WON_GAME_5))
          break
        case 10:
          wonBadges.push(getBadge(BADGES.BADGE_WON_GAME_10))
          break
      }
    }
    // Won Game without Joker
    if (this.hasWonGame && !this.jokerUsed) {
      wonBadges.push(getBadge(BADGES.BADGE_NO_JOKER))
    }

    // Won Game in Time
    if (this.hasWonGame) {
      if (this.secondsElapsed < 5 * 60) wonBadges.push(getBadge(BADGES.BADGE_WON_TIME_5))
      if (this.secondsElapsed < 2 * 60) wonBadges.push(getBadge(BADGES.BADGE_WON_TIME_2))
      if (this.secondsElapsed < 60) wonBadges.push(getBadge(BADGES.BADGE_WON_TIME_1))
      if (this.secondsElapsed < 30) wonBadges.push(getBadge(BADGES.BADGE_WON_TIME_30))
    }

    //filter out already won badges
    const userBadges = currentUser.badges
    let newBadges: BadgeType[] = []
    wonBadges.forEach((badge) => {
      if (
        userBadges.find((userBadge) => {
          return userBadge === badge.type
        }) === undefined
      ) {
        newBadges.push(badge)
      }
    })

    this.wonBadges = newBadges
  }
}

export default GameStore
