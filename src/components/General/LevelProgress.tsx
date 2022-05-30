import LinearProgress from "@mui/material/LinearProgress"

interface LevelProgressProps {
  progress: number
}
const LevelProgress = ({ progress }: LevelProgressProps) => {
  return <LinearProgress variant="determinate" value={progress} sx={{ height: "10px", width: "100%", borderRadius: "5px" }} />
}
export default LevelProgress
