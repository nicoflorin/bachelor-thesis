import React from "react"
import UserStore from "./userStore"
import AuthStore from "./authStore"
import QuizStore from "./quizStore"
import GameStore from "./gameStore"

/**
 * RootStore which holds all other stores (bidirectional)
 */
class RootStore {
  authStore: AuthStore
  userStore: UserStore
  quizStore: QuizStore
  gameStore: GameStore

  constructor() {
    this.authStore = new AuthStore(this)
    this.userStore = new UserStore(this)
    this.quizStore = new QuizStore(this)
    this.gameStore = new GameStore(this)
  }
}

const StoresContext: React.Context<RootStore> = React.createContext(new RootStore())
export const useStores = () => React.useContext(StoresContext)
export { RootStore }
