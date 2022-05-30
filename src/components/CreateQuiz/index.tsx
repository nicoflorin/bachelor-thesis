import Header from "../App/Header"
import React, { useState, useEffect } from "react"
import { observer } from "mobx-react"
import { useNavigate } from "react-router-dom"
import * as ROUTES from "../../constants/routes"
import { useStores } from "../../stores"
import QuizTopic from "../../model/QuizTopic"

// MUI
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"
import Fab from "@mui/material/Fab"
import AddIcon from "@mui/icons-material/Add"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import EditIcon from "@mui/icons-material/Edit"
import IconButton from "@mui/material/IconButton"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"

const CreateQuizTopic = () => {
  const [topicName, setTopicName] = useState<string>("")
  const { quizStore } = useStores()
  const navigate = useNavigate()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopicName(event.target.value)
  }

  const handleAddClick = () => {
    quizStore.setNewQuizTopic(topicName)
    setTopicName("")
    navigate(ROUTES.CREATE_QUIZ_FORM)
  }

  return (
    <>
      <Divider textAlign="left">Create new Quiz</Divider>
      <Grid container>
        <Grid item xs={10} sm={11}>
          <TextField
            fullWidth
            id="newTopicName"
            label="Topic name"
            variant="outlined"
            value={topicName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <Fab
            sx={{ ml: "10px" }}
            size="medium"
            color="primary"
            aria-label="add"
            onClick={handleAddClick}
            disabled={topicName.length === 0}
          >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
    </>
  )
}

const QuizTopicList = observer(() => {
  const { quizStore } = useStores()
  const navigate = useNavigate()

  useEffect(() => {
    quizStore.pullAllQuizTopicsOfUser()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const allQuizTopics = quizStore.getAllQuizTopics()

  const handleEditClick = (quizTopic: QuizTopic): void => {
    quizStore.editQuizTopic(quizTopic)
    navigate(ROUTES.CREATE_QUIZ_FORM)
  }

  return (
    <>
      <Divider textAlign="left">Edit your Quiz</Divider>
      <List>
        {allQuizTopics?.map((quizTopic, i) => (
          <ListItem
            disablePadding
            key={i}
            secondaryAction={
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(quizTopic)}>
                <EditIcon />
              </IconButton>
            }
          >
            <ListItemButton>
              <ListItemText primary={quizTopic.name} secondary={!quizTopic.isActive && "Deactivated"} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
})

export default function CreateQuiz() {
  return (
    <>
      <Header title="Create Quiz" />
      {/* if not role 2 redirect to home */}
      <Stack spacing={2}>
        <CreateQuizTopic />
        <QuizTopicList />
      </Stack>
    </>
  )
}
