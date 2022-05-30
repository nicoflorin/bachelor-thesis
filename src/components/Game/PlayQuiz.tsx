import { useRef } from "react"
import { observer } from "mobx-react"
import { useStores } from "../../stores"
import { useNavigate } from "react-router-dom"
import { ActiveQuestion, ActiveAnswer } from "../../stores/gameStore"
import * as GAME_CONSTANTS from "../../constants/game"
import QuestionList from "./QuestionList"
import * as ROUTES from "../../constants/routes"
import GameOverModal from "./GameOverModal"
import JokerIcon from "../General/JokerIcon"

// MUI
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import LinearProgress from "@mui/material/LinearProgress"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Fab from "@mui/material/Fab"
import Badge from "@mui/material/Badge"
import Divider from "@mui/material/Divider"

/**
 * Question Component
 */
interface QuestionProps {
  text: string
  imageUrl: string | undefined
}

const Question = ({ text, imageUrl }: QuestionProps) => {
  const questionStyle = {
    width: "100%",
    p: "20px",
    textAlign: "center",
    verticalAlign: "middle",
    backgroundColor: "#bbdefb",
  }

  return (
    <Paper sx={questionStyle}>
      <Typography variant="h6" component="h2">
        {text}
      </Typography>
      {imageUrl && <img src={imageUrl} alt="Question" className="questionImage" />}
    </Paper>
  )
}

/**
 * Answer Component
 */
interface AnswerProps {
  id: number
  answer: ActiveAnswer
}

const Answer = observer(({ id, answer }: AnswerProps) => {
  const { gameStore } = useStores()
  const answerRef = useRef<HTMLButtonElement>(null)
  const WAIT_TIME = 2000 //2s

  const setAnswerBackground = (reset: boolean) => {
    if (!answerRef?.current) return
    if (reset) {
      answerRef.current.style.backgroundColor = ""
      return
    }
    const correctColor = "#e8f5e9"
    const wrongColor = "#ffcdd2"
    answerRef.current.style.backgroundColor = answer.isCorrect ? correctColor : wrongColor
  }

  const handleAnswerClick = (answer: ActiveAnswer) => {
    setAnswerBackground(false)
    gameStore.endTimer()
    // wait 2 sec before going to next question
    setTimeout(() => {
      setAnswerBackground(true)
      gameStore.answerSelected(answer)
    }, WAIT_TIME)
  }

  const answerStyle = {
    width: "100%",
    p: "10px",
    verticalAlign: "middle",
    textTransform: "unset !important",
    fontWeight: "normal",
  }

  return (
    <Paper elevation={3} key={id}>
      <IconButton ref={answerRef} variant="outlined" size="medium" onClick={() => handleAnswerClick(answer)} sx={answerStyle}>
        {answer.text}
      </IconButton>
    </Paper>
  )
})

/**
 * Showing of Time Progress Bar
 */
const TimeProgress = observer(() => {
  const { gameStore } = useStores()
  const secondsRemaining = gameStore.getSecondsRemaining()
  const color = secondsRemaining < GAME_CONSTANTS.SECONDS_PER_QUESTION / 4 ? "error" : "primary"
  //calculate progress based on remaining seconds
  //GAME_CONSTANTS.SECONDS_PER_QUESTION = 100%
  const progress = (secondsRemaining * 100) / GAME_CONSTANTS.SECONDS_PER_QUESTION
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} color={color} />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {secondsRemaining + "s"}
        </Typography>
      </Box>
    </Box>
  )
})

/**
 * Joker Buttons
 */
const Jokers = observer(() => {
  const { gameStore } = useStores()
  const jokers = gameStore.getJokers()

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-evenly">
      {jokers.map((joker) => {
        return (
          <Badge badgeContent={joker.count} color="primary" key={joker.type}>
            <Fab
              variant="extended"
              onClick={joker.run}
              disabled={joker.count === 0 || joker.used === true}
              sx={{ minWidth: 120, backgroundColor: "#e8f5e9" }}
            >
              <JokerIcon type={joker.type} />
              {joker.name}
            </Fab>
          </Badge>
        )
      })}
    </Box>
  )
})

//Game
interface PlayQuizStartedProps {
  activeQuestion: ActiveQuestion
}
const PlayQuizStarted = observer(({ activeQuestion }: PlayQuizStartedProps) => {
  return (
    <>
      <Grid container spacing={2} flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "center", sm: "flex-start" }}>
        <Grid item xs={12} sx={{ width: "100%" }}>
          <TimeProgress />
        </Grid>
        <Grid container item xs={12} md={10} spacing={2} sx={{ alignContent: "flex-start" }}>
          <Grid item xs={12}>
            <Question text={activeQuestion.question} imageUrl={activeQuestion.imageUrl} />
          </Grid>
          {activeQuestion.answers.slice(0, 2).map((answer, i) => (
            <Grid item xs={6} key={i}>
              <Answer id={i} answer={answer} />
            </Grid>
          ))}
          {activeQuestion.answers.slice(2, 4).map((answer, i) => (
            <Grid item xs={6} key={i}>
              <Answer id={i} answer={answer} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }}>Jokers</Divider>
            <Jokers />
          </Grid>
        </Grid>
        <Grid item xs={12} md={2} sx={{ width: "100%", display: { md: "none" } }}>
          <Divider>Questions</Divider>
        </Grid>
        <Grid item xs={12} md={2} sx={{ pt: 0 }}>
          <QuestionList />
        </Grid>
      </Grid>
    </>
  )
})

const PlayQuiz = observer(() => {
  const { gameStore } = useStores()
  const activeQuestion: ActiveQuestion | undefined = gameStore.getActiveQuestion()
  const navigate = useNavigate()

  const onModalClose = () => {
    navigate(ROUTES.PLAY_GAME)
  }

  if (!activeQuestion) return <CircularProgress />

  window.onbeforeunload = function () {
    return "Reloading will abort the current game and your progress will be lost!"
  }

  return (
    <>
      <PlayQuizStarted activeQuestion={activeQuestion} />
      <GameOverModal onClose={onModalClose} />
    </>
  )
})

export default PlayQuiz
