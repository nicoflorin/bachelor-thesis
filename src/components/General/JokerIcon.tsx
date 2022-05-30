import TimerOffIcon from "@mui/icons-material/TimerOff"
import StarHalfIcon from "@mui/icons-material/StarHalf"
import { JOKER } from "../../constants/game"

interface JokerIconProps {
  type: JOKER
}
const JokerIcon = ({ type }: JokerIconProps) => {
  let icon
  switch (type) {
    case JOKER.JOKER_5050:
      icon = <StarHalfIcon sx={{ mr: 1 }} />
      break
    case JOKER.JOKER_TIMER_STOP:
      icon = <TimerOffIcon sx={{ mr: 1 }} />
      break
  }

  return icon
}
export default JokerIcon
