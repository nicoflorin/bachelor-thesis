import Header from "../App/Header"
import { useState, useEffect } from "react"
import { observer } from "mobx-react"
import { useStores } from "../../stores"
import QuizTopic from "../../model/QuizTopic"
import { Routes, Route, useNavigate } from "react-router-dom"
import PlayQuizPage from "./PlayQuiz"

// MUI
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import SearchIcon from "@mui/icons-material/Search"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"
import DoneIcon from "@mui/icons-material/Done"
import Snackbar from "@mui/material/Snackbar"

const SearchQuiz = observer(() => {
  const { quizStore } = useStores()
  const [searchTerm, setSearchTerm] = useState<string>("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    quizStore.filterAllQuizTopicsByName(event.target.value)
  }

  return (
    <>
      <Divider textAlign="left">Search Quiz</Divider>
      <TextField
        fullWidth
        id="searchQuiz"
        label="Enter Quiz Name"
        variant="outlined"
        InputProps={{ endAdornment: <SearchIcon /> }}
        value={searchTerm}
        onChange={handleChange}
      />
    </>
  )
})

interface QuizTopicListItemProp {
  quizTopic: QuizTopic
}
const QuizTopicListItem = observer(({ quizTopic }: QuizTopicListItemProp) => {
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackbartext, setSnackbartext] = useState<string>("")
  const { gameStore, quizStore } = useStores()
  const navigate = useNavigate()
  const isCompleted = quizStore.isQuizTopicCompleted(quizTopic)

  const handleClick = (quizTopic: QuizTopic): void => {
    if (!quizTopic.isActive) {
      setSnackbartext("Quiz is inactive. Please contact teacher for activation.")
      setOpenSnackbar(true)
      return
    }
    if (isCompleted) {
      setSnackbartext("Quiz already completed. To see questions/answers, go to achievements.")
      setOpenSnackbar(true)
      return
    }
    gameStore.startGame(quizTopic)
    navigate(quizTopic.quizTopicId)
  }

  const handleSnackbarClose = () => {
    setSnackbartext("")
    setOpenSnackbar(false)
  }

  const icon = isCompleted ? <DoneIcon color="success" /> : <SportsEsportsIcon />
  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton edge="end" aria-label="view" onClick={() => handleClick(quizTopic)}>
            {icon}
          </IconButton>
        }
        disabled={!quizTopic.isActive}
      >
        <ListItemButton onClick={() => handleClick(quizTopic)}>
          <ListItemText primary={quizTopic.name} secondary={`Created by: ${quizTopic.createdByName}`} />
        </ListItemButton>
      </ListItem>
      <Snackbar open={openSnackbar} autoHideDuration={5000} message={snackbartext} onClose={handleSnackbarClose} />
    </>
  )
})

const QuizTopicList = observer(() => {
  const { quizStore } = useStores()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    quizStore.pullAllQuizTopics().finally(() => {
      setIsLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const allQuizTopics = quizStore.getSearchQuizTopics()

  return (
    <>
      <Divider textAlign="left">Select Quiz</Divider>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <List>
          {allQuizTopics?.map((quizTopic, i) => (
            <QuizTopicListItem quizTopic={quizTopic} key={i} />
          ))}
        </List>
      )}
    </>
  )
})

const SelectGamePage = () => {
  return (
    <>
      <Header title="Play" />
      <Stack spacing={2}>
        <SearchQuiz />
        <QuizTopicList />
      </Stack>
    </>
  )
}

export default function PlayGame() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SelectGamePage />} />
        <Route path=":id" element={<PlayQuizPage />} />
      </Routes>
    </>
  )
}
