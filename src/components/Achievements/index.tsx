import Header from "../App/Header"
import { useState, useEffect } from "react"
import { observer } from "mobx-react"
import { useStores } from "../../stores"
import { getBadge, ALL_BADGES } from "../../constants/badges"
import LevelProgress from "../General/LevelProgress"
import User from "../../model/User"
import JokerIcon from "../General/JokerIcon"
import { jokerName } from "../../constants/game"
import { includes } from "lodash"
import { BADGES } from "../../constants/badges"
import { Routes, Route, useNavigate } from "react-router-dom"
import QuizTopic from "../../model/QuizTopic"
import CompletedQuizPage from "./CompletedQuiz"
import Image from "../General/Image"

// MUI
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Stack from "@mui/material/Stack"
import Badge from "@mui/material/Badge"
import CircularProgress from "@mui/material/CircularProgress"
import ListItemButton from "@mui/material/ListItemButton"
import VisibilityIcon from "@mui/icons-material/Visibility"
import IconButton from "@mui/material/IconButton"

interface LevelProp {
  user: User
}
const Level = ({ user }: LevelProp) => {
  const totalPoints = user.points || 0
  const neededPoints = user.getNextLevelPoints()
  const progress = user.getLevelProgress()
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {`Level ${user.level}`}
        </Typography>
        <LevelProgress progress={progress} />
        <Typography>{`${totalPoints.toLocaleString("en")} / ${neededPoints.toLocaleString("en")} Points`}</Typography>
      </CardContent>
    </Card>
  )
}

interface BadgesProp {
  user: User
}
interface BadgeItemProp {
  badgeType: BADGES
}
const Badges = ({ user }: BadgesProp) => {
  const userBadges = user.badges
  let remainingBadges: BADGES[] = []

  ALL_BADGES.forEach((badge) => {
    if (!includes(userBadges, badge.type)) {
      remainingBadges.push(badge.type)
    }
  })

  const BadgeItem = ({ badgeType }: BadgeItemProp) => {
    const badge = getBadge(badgeType)
    return (
      <ListItem>
        <ListItemIcon>
          <Image fileName={`badges/${badge.img}`} alt={badge.text} className={"badge"} />
        </ListItemIcon>
        <ListItemText primary={badge.text} />
      </ListItem>
    )
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Badges
        </Typography>
        <Typography variant="subtitle1">Your Badges</Typography>
        <List>
          {userBadges.map((badge, i) => {
            return <BadgeItem badgeType={badge} key={badge} />
          })}
        </List>

        {remainingBadges.length > 0 && (
          <>
            <Typography variant="subtitle1">Remaining Badges</Typography>
            <List>
              {remainingBadges.map((badge) => {
                return <BadgeItem badgeType={badge} key={badge} />
              })}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface JokersProp {
  user: User
}
const Jokers = ({ user }: JokersProp) => {
  const jokers = user.jokers
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Jokers
        </Typography>
        <List>
          {jokers.map((joker, i) => {
            return (
              <ListItem key={i}>
                <ListItemIcon>
                  <Badge badgeContent={joker.count} color="primary" showZero>
                    <JokerIcon type={joker.type} />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary={jokerName(joker.type)} />
              </ListItem>
            )
          })}
        </List>
      </CardContent>
    </Card>
  )
}

const CompletedQuizTopicList = observer(() => {
  const { quizStore } = useStores()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const completedQuizTopics = quizStore.getCompletedQuizTopics()

  useEffect(() => {
    setIsLoading(true)
    quizStore.pullAllCompletedQuizTopicsOfUser().finally(() => {
      setIsLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (quizTopic: QuizTopic): void => {
    navigate(quizTopic.quizTopicId)
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Completed Quiz
          </Typography>
          {completedQuizTopics.length === 0 && <Typography variant="subtitle1">None</Typography>}
          {isLoading ? (
            <CircularProgress />
          ) : (
            <List>
              {completedQuizTopics?.map((quizTopic, i) => (
                <ListItem
                  disablePadding
                  key={i}
                  secondaryAction={
                    <IconButton edge="end" aria-label="view" onClick={() => handleClick(quizTopic)}>
                      <VisibilityIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => handleClick(quizTopic)}>
                    <ListItemText primary={quizTopic.name} secondary={`Created by: ${quizTopic.createdByName}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </>
  )
})

const AchievementsOverview = observer(() => {
  const { userStore } = useStores()
  const currentUser = userStore.getCurrentUser()
  if (!currentUser) return <></>
  return (
    <>
      <Header title="Achievements" />
      <Stack spacing={2}>
        <Level user={currentUser} />
        <Jokers user={currentUser} />
        <Badges user={currentUser} />
        <CompletedQuizTopicList />
      </Stack>
    </>
  )
})

const Achievements = observer(() => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AchievementsOverview />} />
        <Route path=":id" element={<CompletedQuizPage />} />
      </Routes>
    </>
  )
})
export default Achievements
