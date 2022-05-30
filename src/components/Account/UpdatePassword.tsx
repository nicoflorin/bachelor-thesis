import { useState } from "react"
import { useStores } from "../../stores"
import { FIREBASE_ERRORS } from "../../constants/firebase"
import { useFormik } from "formik"
import * as yup from "yup"

// Material-UI
import Alert from "@mui/material/Alert"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

interface FormValues {
  password1: string
  password2: string
}

const validationSchema = yup.object({
  password1: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password is required"),
  password2: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required")
    .oneOf([yup.ref("password1"), null], "Password must match"),
})

export default function UpdatePassword() {
  const { authStore } = useStores()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onFinish = (values: FormValues) => {
    setIsLoading(true)
    authStore
      .doUpdatePassword(values.password1)
      .then(() => {
        authStore.doSignOut()
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
      password1: "",
      password2: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: FormValues) => {
      onFinish(values)
    },
  })
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          New Password
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            margin="normal"
            id="password1"
            name="password1"
            label="Password"
            type="password"
            autoFocus
            value={formik.values.password1}
            autoComplete="new-password"
            onChange={formik.handleChange}
            error={formik.touched.password1 && Boolean(formik.errors.password1)}
            helperText={formik.touched.password1 && formik.errors.password1}
          />
          <TextField
            fullWidth
            margin="normal"
            id="password2"
            name="password2"
            label="Confirm Password"
            type="password"
            value={formik.values.password2}
            onChange={formik.handleChange}
            autoComplete="new-password"
            error={formik.touched.password2 && Boolean(formik.errors.password2)}
            helperText={formik.touched.password2 && formik.errors.password2}
          />
          <Button sx={{ mt: 3 }} color="primary" variant="contained" fullWidth type="submit" disabled={isLoading}>
            Set new password
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
