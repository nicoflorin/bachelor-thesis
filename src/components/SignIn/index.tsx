import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useStores } from "../../stores"
import * as ROUTES from "../../constants/routes"
import { FIREBASE_ERRORS } from "../../constants/firebase"
import { useFormik } from "formik"
import * as yup from "yup"

// Material-UI
import Alert from "@mui/material/Alert"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container/Container"
import Avatar from "@mui/material/Avatar"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

interface FormValues {
  email: string
  password: string
}

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password is required"),
})

const SignInForm = () => {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onFinish = (values: FormValues) => {
    setIsLoading(true)

    authStore
      .doSignInWithEmailAndPassword(values.email, values.password)
      .then((authUser) => {
        navigate(ROUTES.LANDING)
      })
      .catch((error) => {
        console.log(error.message)
        setError(FIREBASE_ERRORS[error.code] || "Unexpected Error")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: FormValues) => {
      onFinish(values)
    },
  })

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        fullWidth
        margin="normal"
        id="email"
        name="email"
        label="Email"
        autoComplete="email"
        autoFocus
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
        fullWidth
        margin="normal"
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />
      <Button sx={{ mt: 3, mb: 2 }} color="primary" variant="contained" fullWidth type="submit" disabled={isLoading}>
        SIGN IN
      </Button>
      <Link to={ROUTES.SIGN_UP}>Don't have an account? Sign Up</Link>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  )
}

export default function SignIn() {
  return (
    <Container component="main" maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <SignInForm />
      </Box>
    </Container>
  )
}
