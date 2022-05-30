export const SECONDS_PER_QUESTION: number = 40
export const LEVEL_OFFSET: number = 1000000

const QUESTION_LEVEL_POINTS: any = {
  1: 50,
  2: 100,
  3: 200,
  4: 300,
  5: 500,
  6: 1000,
  7: 2000,
  8: 4000,
  9: 8000,
  10: 160000,
  11: 320000,
  12: 640000,
  13: 125000,
  14: 500000,
  15: 1000000,
}

/**
 * Convertes Question Level to corresponding point it gives
 * @param level
 * @returns
 */
export const questionLevelToPoint = (level: number): number => {
  return QUESTION_LEVEL_POINTS[level]
}

/**
 * Returns the needed points for the next level
 * @param currentLevel
 * @returns number
 */
export const nextLevelPoints = (currentLevel: number): number => {
  return (currentLevel + 1) * LEVEL_OFFSET
}

//------------------------------
// JOKERS
//------------------------------
export enum JOKER {
  JOKER_5050 = "1",
  JOKER_TIMER_STOP = "2",
}

export interface JokerType {
  type: JOKER
  name: string
  count: number
  used: boolean
  run(): void
}
const JOKER_5050: JokerType = {
  type: JOKER.JOKER_5050,
  name: "50 : 50",
  count: 0,
  used: false,
  run: (): void => {
    console.log("dummy")
  },
}

const JOKER_TIMER_STOP: JokerType = {
  type: JOKER.JOKER_TIMER_STOP,
  name: "Pause Time",
  count: 0,
  used: false,
  run: (): void => {
    console.log("dummy")
  },
}

export const jokers = [JOKER_5050, JOKER_TIMER_STOP]

export const jokerName = (type: JOKER) => {
  const joker = jokers.find((joker) => {
    return joker.type === type
  })
  return joker?.name
}
