import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useStores } from "../../stores"
import * as ROUTES from "../../constants/routes"
import { FIREBASE_ERRORS } from "../../constants/firebase"
import * as yup from "yup"
import { useFormik } from "formik"

// Material-UI
import Alert from "@mui/material/Alert"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container/Container"
import Avatar from "@mui/material/Avatar"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"

interface FormValues {
  firstname: string
  lastname: string
  email: string
  password: string
  isTeacher: boolean
}

const validationSchema = yup.object({
  firstname: yup.string().required("First Name is required"),
  lastname: yup.string().required("Last Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password is required"),
})

const SignUpForm = () => {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onFinish = (values: FormValues) => {
    setIsLoading(true)

    authStore
      .doCreateUserWithEmailAndPassword(values.firstname, values.lastname, values.email, values.password, values.isTeacher)
      .then(() => {
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
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      isTeacher: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values: FormValues) => {
      onFinish(values)
    },
  })

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="firstname"
            label="First Name"
            name="firstname"
            autoFocus
            autoComplete="given-name"
            value={formik.values.firstname}
            onChange={formik.handleChange}
            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
            helperText={formik.touched.firstname && formik.errors.firstname}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="lastname"
            label="Last Name"
            name="lastname"
            autoComplete="family-name"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            helperText={formik.touched.lastname && formik.errors.lastname}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
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
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch id="isTeacher" value={formik.values.isTeacher} onChange={formik.handleChange} />}
            label="I am a teacher"
          />
        </Grid>{" "}
      </Grid>
      <Button sx={{ mt: 2, mb: 2 }} color="primary" variant="contained" fullWidth type="submit" disabled={isLoading}>
        SIGN UP
      </Button>
      <Link to={ROUTES.SIGN_IN}>Already have an account? Sign In</Link>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  )
}

export default function SignUp() {
  return (
    <Container component="main" maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <SignUpForm />
      </Box>
    </Container>
  )
}
