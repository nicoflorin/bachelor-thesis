import Header from "../App/Header"
import { useStores } from "../../stores"
import { observer } from "mobx-react"
import User from "../../model/User"
import UpdatePassword from "./UpdatePassword"

// MUI
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Stack from "@mui/material/Stack"

interface AccountInformationProp {
  user: User
}
const AccountInformation = observer(({ user }: AccountInformationProp) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Account Information
        </Typography>
        <Typography variant="body1">Name: {user.getName()}</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
      </CardContent>
    </Card>
  )
})

const Account = observer(() => {
  const { userStore } = useStores()
  const currentUser = userStore.getCurrentUser()
  if (!currentUser) return <></>

  return (
    <>
      <Header title="Account" />
      <Stack spacing={2}>
        <AccountInformation user={currentUser} />
        <UpdatePassword />
      </Stack>
    </>
  )
})
export default Account
