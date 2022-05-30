import Typography from "@mui/material/Typography"

type Props = {
  title: string
}
export default function Header({ title }: Props) {
  return (
    <Typography variant="h2" component="div" gutterBottom>
      {title}
    </Typography>
  )
}
