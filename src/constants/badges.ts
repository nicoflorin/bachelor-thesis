import { find } from "lodash"

export enum BADGES {
  BADGE_DUMMY = "0,",
  BADGE_WON_GAME_1 = "1",
  BADGE_WON_GAME_5 = "2",
  BADGE_WON_GAME_10 = "3",
  BADGE_NO_JOKER = "4",
  BADGE_WON_TIME_5 = "5",
  BADGE_WON_TIME_2 = "6",
  BADGE_WON_TIME_1 = "7",
  BADGE_WON_TIME_30 = "8",
}

export interface BadgeType {
  type: BADGES
  text: string
  img: string
}

// WON GAMES
export const BADGE_WON_GAME_1: BadgeType = {
  type: BADGES.BADGE_WON_GAME_1,
  text: "Won 1 Game",
  img: "badge_won_1_game.png",
}

export const BADGE_WON_GAME_5: BadgeType = {
  type: BADGES.BADGE_WON_GAME_5,
  text: "Won 5 Games",
  img: "badge_won_5_game.png",
}

export const BADGE_WON_GAME_10: BadgeType = {
  type: BADGES.BADGE_WON_GAME_10,
  text: "Won 10 Games",
  img: "badge_won_10_game.png",
}

// NO JOKER
export const BADGE_NO_JOKER: BadgeType = {
  type: BADGES.BADGE_NO_JOKER,
  text: "Won Game without Joker",
  img: "badge_no_joker.png",
}

// TIME BADGES
export const BADGE_WON_TIME_5: BadgeType = {
  type: BADGES.BADGE_WON_TIME_5,
  text: "Won Game in 5 Minutes",
  img: "badge_won_time_5.png",
}

export const BADGE_WON_TIME_2: BadgeType = {
  type: BADGES.BADGE_WON_TIME_2,
  text: "Won Game in 2 Minutes",
  img: "badge_won_time_2.png",
}

export const BADGE_WON_TIME_1: BadgeType = {
  type: BADGES.BADGE_WON_TIME_1,
  text: "Won Game in 1 Minute",
  img: "badge_won_time_1.png",
}

export const BADGE_WON_TIME_30: BadgeType = {
  type: BADGES.BADGE_WON_TIME_30,
  text: "Won Game in 30 Seconds",
  img: "badge_won_time_30.png",
}

export const ALL_BADGES = [
  BADGE_WON_GAME_1,
  BADGE_WON_GAME_5,
  BADGE_WON_GAME_10,
  BADGE_NO_JOKER,
  BADGE_WON_TIME_5,
  BADGE_WON_TIME_2,
  BADGE_WON_TIME_1,
  BADGE_WON_TIME_30,
]

export const getBadge = (type: BADGES): BadgeType => {
  return find(ALL_BADGES, ["type", type]) || ({ type: BADGES.BADGE_DUMMY, text: "" } as BadgeType)
}
