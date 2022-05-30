import { ROLES } from "./roles"

//MUI
import HomeIcon from "@mui/icons-material/Home"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import LoginIcon from "@mui/icons-material/Login"
import AddIcon from "@mui/icons-material/Add"
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"
import LeaderboardIcon from "@mui/icons-material/Leaderboard"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { SvgIconTypeMap } from "@mui/material/SvgIcon"

export const LANDING: string = "/"
export const SIGN_UP: string = "/signup"
export const SIGN_IN: string = "/signin"
export const ACCOUNT: string = "/account"
export const CREATE_QUIZ: string = "/create-quiz"
export const CREATE_QUIZ_FORM: string = "/create-quiz-form"
export const PLAY_GAME: string = "/play-game"
export const PASSWORD_FORGET: string = "/pw-forget"
export const LEADERBOARD: string = "leaderboard"
export const ACHIEVEMENTS: string = "achievements"

interface Route {
  to: string
  name: string
  role?: ROLES
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string
  }
}

const nonAuthRoutes: Route[] = [
  {
    to: LANDING,
    name: "Home",
    Icon: HomeIcon,
  },
  {
    to: SIGN_UP,
    name: "Sign Up",
    Icon: PersonAddIcon,
  },
  {
    to: SIGN_IN,
    name: "Sign In",
    Icon: LoginIcon,
  },
]

const authRoutes: Route[] = [
  {
    to: LANDING,
    name: "Home",
    Icon: HomeIcon,
  },
  {
    to: CREATE_QUIZ,
    name: "Create Quiz",
    role: ROLES.TEACHER,
    Icon: AddIcon,
  },
  {
    to: PLAY_GAME,
    name: "Play",
    role: ROLES.STUDENT,
    Icon: SportsEsportsIcon,
  },
  {
    to: LEADERBOARD,
    name: "Leaderboard",
    Icon: LeaderboardIcon,
  },
  {
    to: ACHIEVEMENTS,
    name: "Achievements",
    role: ROLES.STUDENT,
    Icon: EmojiEventsIcon,
  },
]

export const routes = { nonAuthRoutes, authRoutes }
