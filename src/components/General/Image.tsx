import useImage from "../../hooks/useImage"
import Typography from "@mui/material/Typography"

interface ImageProps {
  fileName: string
  alt?: string
  className?: string
}
const Image = ({ fileName, alt, className, ...rest }: ImageProps) => {
  const { loading, error, image } = useImage(fileName)

  if (error) return <Typography>{alt}</Typography>

  return (
    <>
      {loading ? (
        <Typography>loading...</Typography>
      ) : (
        <img className={`Image${className ? className.padStart(className.length + 1) : ""}`} src={image} alt={alt} {...rest} />
      )}
    </>
  )
}

export default Image
