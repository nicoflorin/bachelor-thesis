import { observer } from "mobx-react"
import { useStores } from "../../stores"
import { ActiveQuestion } from "../../stores/gameStore"

// MUI
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import HelpIcon from "@mui/icons-material/Help"
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"

interface QuestionListItemProps {
  question: ActiveQuestion
}

const QuestionListItem = observer((props: QuestionListItemProps) => {
  let icon: any
  const question = props.question
  const style = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    color: "#000",
    paddingLeft: "10px",
  }

  if (question.active) {
    icon = question.isSecure ? <HealthAndSafetyIcon color="warning" /> : <HelpIcon color="disabled" />
    style.backgroundColor = "#e8f5e9"
  } else {
    if (question.done) {
      icon = question.isSecure ? <HealthAndSafetyIcon color="success" /> : <CheckCircleIcon color="success" />
    } else {
      if (question.isSecure) {
        icon = <HealthAndSafetyIcon color="warning" />
        style.color = "#ed6c02"
      } else {
        icon = <HelpIcon color="disabled" />
      }
    }
  }

  return (
    <ListItem disablePadding style={style}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={`${question.level} - ${question.points.toLocaleString("en")}`} sx={{ mr: 1 }} />
    </ListItem>
  )
})

const QuestionList = observer(() => {
  const { gameStore } = useStores()
  const activeQuiz = gameStore.getActiveQuiz() //copy and reverse array
  const questions = activeQuiz.questions.slice().reverse()
  return (
    <List>
      {questions.map((question) => {
        return <QuestionListItem question={question} />
      })}
    </List>
  )
})

export default QuestionList
