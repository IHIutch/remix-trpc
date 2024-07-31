import Compressor from 'compressorjs'

export function getErrorMessage(error: unknown) {
  if (error instanceof Error)
    return error.message
  return String(error)
}

export async function resizeImage(file: File): Promise<File> {
  return await new Promise((resolve, reject) => {
    return new Compressor(file, {
      quality: 0.7,
      maxHeight: 2048,
      maxWidth: 2048,
      mimeType: 'image/webp',
      success: (result) => {
        if (result instanceof File) {
          const newFileName = result.name.replace(/\.[^.]+$/, '.webp')
          const newFile = new File([file], newFileName, { type: 'image/webp', lastModified: file.lastModified })
          return resolve(newFile)
        }
        else {
          const newFileName = file.name.replace(/\.[^.]+$/, '.webp')
          const blobToFile = new File([result], newFileName, {
            type: result.type,
          })
          return resolve(blobToFile)
        }
      },
      error: reject,
    })
  })
}
