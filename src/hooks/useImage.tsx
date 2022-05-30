import { useEffect, useState } from "react"

/**
 * Hook to load an image. Returns loading, error and image information
 * @param fileName string
 * @returns Object {loading: boolean, error: any, image: string}
 */
const useImage = (fileName: string) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)
  const [image, setImage] = useState<string>("")

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await import(`../images/${fileName}`)
        setImage(response.default)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [fileName])

  return {
    loading,
    error,
    image,
  }
}

export default useImage
