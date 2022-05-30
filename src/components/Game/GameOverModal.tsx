import { observer } from "mobx-react"
import { useStores } from "../../stores"
import LevelProgress from "../General/LevelProgress"
import Image from "../General/Image"
import { BadgeType } from "../../constants/badges"

// MUI
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Fade from "@mui/material/Fade"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import TimerOffIcon from "@mui/icons-material/TimerOff"
import StarHalfIcon from "@mui/icons-material/StarHalf"

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "300px",
  bgcolor: "background.paper",
  border: "2px solid #fff",
  borderRadius: "25px",
  boxShadow: 24,
  p: 3,
}

const LevelUp = () => {
  return (
    <>
      <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
        Level Up!
      </Typography>
      <Typography variant="subtitle1">Earned Jokers</Typography>
      <List dense sx={{ p: 0 }}>
        <ListItem>
          <ListItemIcon>
            <StarHalfIcon />
          </ListItemIcon>
          <ListItemText primary="50:50 Joker" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <TimerOffIcon />
          </ListItemIcon>
          <ListItemText primary="Timer-Stop Joker" />
        </ListItem>
      </List>
    </>
  )
}

interface WonBadgesProps {
  badges: BadgeType[]
}
const WonBadges = ({ badges }: WonBadgesProps) => {
  return (
    <>
      <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
        New Badges
      </Typography>
      <List dense sx={{ p: 0 }}>
        {badges.map((badge) => {
          return (
            <ListItem>
              <ListItemIcon>
                <Image fileName={`badges/${badge.img}`} alt={badge.text} className={"badge"} />
              </ListItemIcon>
              <ListItemText primary={badge.text} />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

interface GameOverModalProps {
  onClose: () => void
}

const GameOverModal = observer(({ onClose }: GameOverModalProps) => {
  const { gameStore, userStore } = useStores()
  const currentUser = userStore.getCurrentUser()
  if (!currentUser) return <></>

  const open = gameStore.getGameOver()
  const totalPoints = gameStore.getTotalPoints()
  const minusPoints = gameStore.getMinusPoints()
  const earnedPoints = gameStore.getEarnedPoints()
  const level = currentUser.level || 0
  const userTotalPoints = currentUser.points || 0
  const neededPoints = currentUser.getNextLevelPoints()
  const progress = currentUser.getLevelProgress()
  const title = earnedPoints > 0 ? `Congratulations!` : "Sorry, maybe next time..."
  const image = earnedPoints > 0 ? <Image fileName={"winTrophyIcon.png"} alt={"Trophy"} className={"winIcon"} /> : null
  const hasLevelUp = gameStore.getHasLevelUp()
  const wonBadges = gameStore.getWonBadges()

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
            <Typography id="transition-modal-title" variant="h5" component="h2">
              {title}
            </Typography>

            {image}
            {hasLevelUp && <LevelUp />}

            <Typography variant="h6" component="h3" sx={{ mt: 1 }}>{`Level ${level}`}</Typography>
            {totalPoints !== 0 && totalPoints !== earnedPoints && (
              <Typography>{`${totalPoints.toLocaleString("en")} Total Points`}</Typography>
            )}
            {minusPoints !== 0 && (
              <Typography color="#c62828">{`-${minusPoints.toLocaleString("en")} Points for using joker`}</Typography>
            )}
            <Typography color="#2e7d32">{`+${earnedPoints.toLocaleString("en")} Earned Points`}</Typography>
            <Typography variant="h6" component="h3" sx={{ mt: 1 }}>
              Your Progress
            </Typography>
            <LevelProgress progress={progress} />
            <Typography>{`${userTotalPoints.toLocaleString("en")}/${neededPoints.toLocaleString("en")} Points`}</Typography>
            {wonBadges.length > 0 && <WonBadges badges={wonBadges} />}
          </Box>
          <Button onClick={onClose} sx={{ float: "right", mt: "10px" }}>
            Close
          </Button>
        </Box>
      </Fade>
    </Modal>
  )
})

export default GameOverModal
