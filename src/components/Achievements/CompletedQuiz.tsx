import { useState, useEffect } from "react"
import Header from "../App/Header"
import { observer } from "mobx-react"
import { useStores } from "../../stores"
import { useParams } from "react-router-dom"
import Quiz, { Question } from "../../model/Quiz"

// MUI
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import CircularProgress from "@mui/material/CircularProgress"

interface QuestionProp {
  question: Question
}
const QuestionItem = observer(({ question }: QuestionProp) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Question: {question.text}
        </Typography>
        <Typography variant="body1">Correct Answer: {question.correctAnswer}</Typography>
        {question.imageUrl && <img src={question.imageUrl} alt="Question" className="questionImage" />}
      </CardContent>
    </Card>
  )
})

const CompletedQuiz = observer(() => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { userStore } = useStores()
  const currentUser = userStore.getCurrentUser()

  if (!currentUser) return <></>

  //get id from url
  const { id: quizTopicId } = useParams()

  if (!quizTopicId) return <CircularProgress />

  useEffect(() => {
    Quiz.GetByTopic(quizTopicId)
      .then((quiz) => {
        setSelectedQuiz(quiz)
      })
      .catch((error) => {
        console.log("could not load quiz")
      })
      .finally(() => setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header title="Completed Quiz" />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={2}>
          {selectedQuiz?.questions.map((question, i) => {
            return <QuestionItem question={question} key={i} />
          })}
        </Stack>
      )}
    </>
  )
})
export default CompletedQuiz
