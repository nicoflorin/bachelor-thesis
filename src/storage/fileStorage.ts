import { FbStorage } from "./firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

const IMAGE_PATH = "images"

/**
 * Uploads a file on the server and returns the url to the file
 * @param file File
 * @param path path on server
 * @param name name of file on server
 * @returns Promise<string> URL of the uploaded file
 */
async function uploadFileToStorage(file: File | null, path: string, name: string): Promise<string> {
  return new Promise<string>(function (resolve, reject) {
    if (!file) return resolve("")
    const metadata = {
      contentType: file.type,
    }
    try {
      const fileRef = ref(FbStorage, `${path}/${name}`)
      const uploadTask = uploadBytesResumable(fileRef, file, metadata)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // log task progress
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused")
              break
            case "running":
              console.log("Upload is running")
              break
          }
        },
        (error) => {
          console.log("Error saving file: ", error)
          reject()
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl)
          })
        }
      )
    } catch {
      console.log("Error saving file")
      reject()
    }
  })
}

/**
 * Uploads an image on the server and returns the url to the file
 * @param image File
 * @param name name on the server
 * @returns Promise<string>
 */
async function uploadImageToStorage(image: File | null, name: string): Promise<string> {
  return await uploadFileToStorage(image, IMAGE_PATH, name)
}

export { uploadImageToStorage }
