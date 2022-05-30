import { useState } from "react"
import { observer } from "mobx-react"
import { useStores } from "../../stores"
import { Question } from "../../model/Quiz"
import { useNavigate, Link } from "react-router-dom"
import * as ROUTES from "../../constants/routes"
import { last } from "lodash"
import { uploadImageToStorage } from "../../storage/fileStorage"
//MUI
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"
import Fab from "@mui/material/Fab"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import CircularProgress from "@mui/material/CircularProgress"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import Alert from "@mui/material/Alert"

type QuizItemImageProps = {
  id: number
  quizId: string
  handleChangeImageUrl: any
  imageUrl: string
}

const QuizItemImage = observer(({ id, quizId, handleChangeImageUrl, imageUrl }: QuizItemImageProps) => {
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false)
  const [imageUploadError, setImageUploadError] = useState<string>("")

  const uploadImage = (image: File) => {
    if (!image) return
    setImageUploadLoading(true)
    const name = `imageQuestion-${quizId}-${id}`
    uploadImageToStorage(image, name)
      .then((url) => {
        handleChangeImageUrl.bind(id)(url) // bind id to function and call with parameter url
        setImageUploadError("")
      })
      .catch(() => {
        setImageUploadError("Error uploading image!")
      })
      .finally(() => {
        setImageUploadLoading(false)
      })
  }

  const onImageChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e) return
    if (!e.currentTarget.files) return

    const reader = new FileReader()
    let file = e.currentTarget.files[0] // get the supplied file
    // if there is a file, set image to that file
    if (file) {
      reader.onload = () => {
        if (reader.readyState === FileReader.DONE) {
          uploadImage(file)
        }
      }
      reader.readAsDataURL(e.currentTarget.files[0])
    }
  }

  const onDeleteClick = () => {
    handleChangeImageUrl.bind(id)("") //set empty url
    setImageUploadError("")
  }

  return (
    <>
      <Typography>Question Image (optional)</Typography>

      {imageUrl ? (
        <>
          <Button variant="text" startIcon={<DeleteIcon />} onClick={onDeleteClick}>
            Delete
          </Button>
          <br />
          <img src={imageUrl} alt="Question" width="100" />
        </>
      ) : (
        <Button variant="text" component="label" color="primary" startIcon={<AddIcon />} disabled={imageUploadLoading}>
          {imageUploadLoading ? "Uploading..." : "Upload"}
          <input
            type="file"
            hidden
            accept="image/x-png,image/jpeg"
            onChange={(e) => {
              onImageChange(e)
            }}
          />
        </Button>
      )}

      {imageUploadError && <Alert severity="error">{imageUploadError}</Alert>}
    </>
  )
})

type QuizItemProps = {
  id: number
  quizId: string
  question: Question
  handleChangeQuestion: any
  handleChangeCorrectAnswer: any
  handleChangeWrongAnswer1: any
  handleChangeWrongAnswer2: any
  handleChangeWrongAnswer3: any
  handleChangeImageUrl: any
}

const QuizItem = observer(
  ({
    id,
    quizId,
    question,
    handleChangeQuestion,
    handleChangeCorrectAnswer,
    handleChangeWrongAnswer1,
    handleChangeWrongAnswer2,
    handleChangeWrongAnswer3,
    handleChangeImageUrl,
  }: QuizItemProps) => {
    const questionLabel: string = "Question " + (id + 1)
    const { quizStore } = useStores()

    const onDeleteClick = () => {
      quizStore.deleteNewQuizQuestion(id)
    }

    return (
      <Accordion>
        <AccordionSummary
          sx={{ alignItems: "center" }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ minWidth: "100px", flexShrink: 0 }}>{questionLabel}</Typography>
          <Typography sx={{ color: "text.secondary" }}>{question.text}</Typography>
          {id > 0 && (
            <IconButton sx={{ ml: "auto", mr: 5 }} aria-label="delete" onClick={onDeleteClick}>
              <DeleteIcon fontSize="inherit" color="error" />
            </IconButton>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="question1"
                    name="question1"
                    label={questionLabel}
                    size="small"
                    value={question.text}
                    onChange={handleChangeQuestion.bind(id)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    id="correctAnswer"
                    name="correctAnswer"
                    label="Correct Answer"
                    size="small"
                    value={question.correctAnswer}
                    onChange={handleChangeCorrectAnswer.bind(id)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    id="wrongAnswer1"
                    name="wrongAnswer1"
                    label="Wrong Answer 1"
                    size="small"
                    value={question.wrongAnswer1}
                    onChange={handleChangeWrongAnswer1.bind(id)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    id="wrongAnswer2"
                    name="wrongAnswer2"
                    label="Wrong Answer 2"
                    size="small"
                    value={question.wrongAnswer2}
                    onChange={handleChangeWrongAnswer2.bind(id)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    id="wrongAnswer3"
                    name="wrongAnswer3"
                    label="Wrong Answer 3"
                    size="small"
                    value={question.wrongAnswer3}
                    onChange={handleChangeWrongAnswer3.bind(id)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <QuizItemImage
                    id={id}
                    quizId={quizId}
                    handleChangeImageUrl={handleChangeImageUrl}
                    imageUrl={question.imageUrl}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>
    )
  }
)

const CreateQuizForm = observer(() => {
  const { quizStore } = useStores()
  const navigate = useNavigate()

  const newQuiz = quizStore.getNewQuiz()
  const newQuizTopic = quizStore.getNewQuizTopic()

  if (!newQuiz || !newQuizTopic) return <CircularProgress />

  const handleAddClick = (): void => {
    quizStore.addNewQuizQuestion()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault() //prevent from reload
    quizStore.submitQuizTopicForm().then(() => navigate(ROUTES.CREATE_QUIZ))
  }

  function handleChangeQuestion(event: React.ChangeEvent<HTMLInputElement>): void {
    quizStore.setNewQuizQuestionText(this, event.target.value)
  }
  function handleChangeCorrectAnswer(event: React.ChangeEvent<HTMLInputElement>): void {
    quizStore.setNewQuizQuestionCorrectAnswer(this, event.target.value)
  }
  function handleChangeWrongAnswer1(event: React.ChangeEvent<HTMLInputElement>): void {
    quizStore.setNewQuizQuestionWrongAnswer1(this, event.target.value)
  }
  function handleChangeWrongAnswer2(event: React.ChangeEvent<HTMLInputElement>): void {
    quizStore.setNewQuizQuestionWrongAnswer2(this, event.target.value)
  }
  function handleChangeWrongAnswer3(event: React.ChangeEvent<HTMLInputElement>): void {
    quizStore.setNewQuizQuestionWrongAnswer3(this, event.target.value)
  }
  function handleChangeImageUrl(url: string): void {
    quizStore.setNewQuizQuestionImageUrl(this, url)
  }

  //check if add button should be disabled
  const addDisabled = (): boolean => {
    //maximum allowed questions
    if (newQuiz.questions.length >= 15) return true

    //last question needs all inputs
    const lastQuestion = last(newQuiz.questions)
    if (!lastQuestion) return false
    if (
      !lastQuestion.text ||
      !lastQuestion.correctAnswer ||
      !lastQuestion.wrongAnswer1 ||
      !lastQuestion.wrongAnswer2 ||
      !lastQuestion.wrongAnswer3
    )
      return true

    //else allowed
    return false
  }

  const submitDisabled = (): boolean => {
    // all question need all inputs
    let questionMissingInformation = false
    newQuiz.questions.forEach((question, i) => {
      if (
        !question.text ||
        !question.correctAnswer ||
        !question.wrongAnswer1 ||
        !question.wrongAnswer2 ||
        !question.wrongAnswer3
      ) {
        questionMissingInformation = true
      }
    })
    return questionMissingInformation
  }

  const createQuizItems = () => {
    return newQuiz?.questions?.map((question, i) => (
      <QuizItem
        key={i}
        id={i}
        quizId={newQuiz.quizId}
        question={question}
        handleChangeQuestion={handleChangeQuestion}
        handleChangeCorrectAnswer={handleChangeCorrectAnswer}
        handleChangeWrongAnswer1={handleChangeWrongAnswer1}
        handleChangeWrongAnswer2={handleChangeWrongAnswer2}
        handleChangeWrongAnswer3={handleChangeWrongAnswer3}
        handleChangeImageUrl={handleChangeImageUrl}
      />
    ))
  }

  const handleDeactivateTopicChange = () => {
    newQuizTopic.isActive = !newQuizTopic.isActive
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={ROUTES.CREATE_QUIZ}>Create Quiz</Link>
        <Typography color="text.primary">Enter Questions</Typography>
      </Breadcrumbs>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <FormGroup sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={newQuizTopic.isActive}
                onChange={handleDeactivateTopicChange}
                inputProps={{ "aria-label": "controlled" }}
                sx={{ mb: 0 }}
              />
            }
            label={newQuizTopic.isActive ? "Topic active" : "Topic inactive"}
          />
        </FormGroup>
        {createQuizItems()}
        <Fab sx={{ mt: 3 }} size="medium" color="primary" aria-label="add" onClick={handleAddClick} disabled={addDisabled()}>
          <AddIcon />
        </Fab>
        <Button sx={{ ml: "auto" }} color="primary" variant="contained" type="submit" disabled={submitDisabled()}>
          Save and exit
        </Button>
      </Box>
    </>
  )
})

export default CreateQuizForm
