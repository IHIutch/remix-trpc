import { Buffer } from 'node:buffer'
import { getPlaiceholder } from 'plaiceholder'
import { getErrorMessage } from '../functions'

export async function getImageData(src: string) {
  try {
    const imgBuffer = await fetch(src).then(async res =>
      Buffer.from(await res.arrayBuffer()),
    )

    const {
      base64: blurDataUrl,
      metadata: {
        height,
        width,
      },
      color: {
        hex,
      },
    } = await getPlaiceholder(imgBuffer, {
      size: 4,
    })

    return { blurDataUrl, height, width, hex }
  }
  catch (error) {
    console.error(getErrorMessage(error))
    return null
  }
}
