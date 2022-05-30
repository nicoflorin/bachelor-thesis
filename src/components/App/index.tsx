import ResponsiveAppBar from "../AppBar"
import LandingPage from "../Landing"
import SignUpPage from "../SignUp"
import SignInPage from "../SignIn"
import CreateQuizPage from "../CreateQuiz"
import CreateQuizFormPage from "../CreateQuiz/CreateQuizForm"
import PlayGamePage from "../Game"
import NotFoundPage from "./NotFound"
import LeaderboardPage from "../Leaderboard"
import AchievementsPage from "../Achievements"
import AccountPage from "../Account"
import * as ROUTES from "../../constants/routes"
import ProtectedRoute from "./ProtectedRoute"

//Router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

// Material-UI
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"

function App() {
  return (
    <div className="App">
      <Router basename="/bachelor-thesis">
        <CssBaseline />
        <ResponsiveAppBar />

        <Container maxWidth="xl" sx={{ height: "100%", p: "10px" }}>
          <Routes>
            <Route path={ROUTES.LANDING} element={<LandingPage />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
            <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
            <Route path={ROUTES.CREATE_QUIZ} element={<ProtectedRoute Component={CreateQuizPage} />} />
            <Route path={ROUTES.CREATE_QUIZ_FORM} element={<ProtectedRoute Component={CreateQuizFormPage} />} />
            <Route path={ROUTES.PLAY_GAME + "/*"} element={<ProtectedRoute Component={PlayGamePage} />} />
            <Route path={ROUTES.LEADERBOARD} element={<ProtectedRoute Component={LeaderboardPage} />} />
            <Route path={ROUTES.ACHIEVEMENTS + "/*"} element={<ProtectedRoute Component={AchievementsPage} />} />
            <Route path={ROUTES.ACCOUNT} element={<ProtectedRoute Component={AccountPage} />} />
            <Route element={<NotFoundPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  )
}

export default App
