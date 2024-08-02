// import {
//   unstable_defineLoader as defineLoader,
// } from '@remix-run/node'
// import { useLoaderData } from '@remix-run/react'
// import { prisma } from '#/utils/prisma.server'
// import { createClient } from '#/utils/supabase/supabase.server'
// import { getImageData } from '#/utils/functions/get-image-data.server'

// export const loader = defineLoader(async ({ request, params }) => {
//   const photos = await prisma.images.findMany({
//     where: {
//       blurDataUrl: null,
//     },
//   })

//   const flattenedPhotos = await Promise.all(photos.map(async (p) => {
//     const imgData = await getImageData(p.src)
//     return {
//       ...p,
//       blurDataUrl: imgData?.blurDataUrl,
//       height: imgData?.height,
//       width: imgData?.width,
//       hex: imgData?.hex,
//     }
//   }))

//   //   const { supabaseClient } = createClient(request)

//   //   const newPhotos = await Promise.all(
//   //     photos
//   //       .filter(p => p?.z_images && p?.z_images?.length > 0)
//   //       .flatMap(async (p) => {
//   //         const arr = await Promise.all(
//   //           p.z_images.map(async (img) => {
//   //             let src = ''
//   //             if (!img.src) {
//   //               src = supabaseClient.storage.from('buffalo311').getPublicUrl(img).data.publicUrl
//   //             }
//   //             else {
//   //               if (img.src.startsWith('public')) {
//   //                 src = supabaseClient.storage.from('buffalo311').getPublicUrl(img.src).data.publicUrl
//   //               }
//   //               else {
//   //                 src = img.src
//   //               }
//   //             }

//   //             const imgData = await getImageData(src)

//   //             return {
//   //               src,
//   //               reportId: p.id,
//   //               blurDataUrl: imgData?.blurDataUrl,
//   //               height: imgData?.height,
//   //               width: imgData?.width,
//   //               hexColor: imgData?.hex,
//   //             }
//   //           }),
//   //         )

//   //         return arr
//   //       }),
//   //   )

//   // Flatten the resulting array of arrays
//   //   const flattenedPhotos = (await Promise.all(newPhotos)).flat().filter(p => !!p.blurDataUrl)

//   flattenedPhotos.forEach(async (p) => {
//     await prisma.images.update({
//       where: {
//         id: p.id,
//       },
//       data: {
//         blurDataUrl: p?.blurDataUrl,
//         height: p?.height,
//         width: p?.width,
//         hexColor: p?.hex,
//       },
//     })
//   })

//   // await prisma.images.updateMany({
//   //   data: flattenedPhotos,
//   // })

//   return {
//     flattenedPhotos,
//   }
// })

// export default function Temp() {
//   const { flattenedPhotos } = useLoaderData<typeof loader>()

//   return (
//     <div>
//       <pre>
//         {JSON.stringify(flattenedPhotos, null, 2)}
//       </pre>
//     </div>
//   )
// }
