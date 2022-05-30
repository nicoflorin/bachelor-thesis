import { observer } from "mobx-react"
import { Navigate } from "react-router-dom"
import { useStores } from "../../stores"
import * as ROUTES from "../../constants/routes"

type Props = {
  Component: React.FunctionComponent<any>
}
const ProtectedRoute = observer(({ Component }: Props) => {
  const { authStore } = useStores()
  const isAuthenticated: boolean = authStore.isAuthenticated()

  return isAuthenticated ? <Component /> : <Navigate to={ROUTES.LANDING} />
})

export default ProtectedRoute
