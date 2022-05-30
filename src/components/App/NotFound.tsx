import * as ROUTES from "../../constants/routes"
import { Link } from "react-router-dom"

// Material-UI
import Button from "@mui/material/Button"

function NotFound() {
  return (
    <Button>
      <Link to={ROUTES.LANDING}>Back Home</Link>
    </Button>
  )
}

export default NotFound
