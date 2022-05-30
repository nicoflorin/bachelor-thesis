import Header from "../App/Header"
import { useEffect, useState } from "react"
import { observer } from "mobx-react"
import { useStores } from "../../stores"

// MUI
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

const Leaderboard = observer(() => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { userStore } = useStores()
  const currentUserId = userStore.getCurrentUserId()

  useEffect(() => {
    setIsLoading(true)
    userStore.pullLeaderboardUsers().finally(() => setIsLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  let allUsers = userStore.getLeaderboardUsers()

  return (
    <>
      <Header title="Leaderboard" />

      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 10 }}>Nr.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Games Played</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUsers?.map((user, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: currentUserId === user.userId ? "#e8f5e9" : null,
                }}
              >
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell>{user.getName()}</TableCell>
                <TableCell>{user.points.toLocaleString("en")}</TableCell>
                <TableCell>{user.level}</TableCell>
                <TableCell>{user.gamesPlayedCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {allUsers?.length === 0 && <div>No Users found</div>}

      {/* Loading Spinner */}
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}
    </>
  )
})
export default Leaderboard
