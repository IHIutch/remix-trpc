import type { VariantProps } from 'cva'
import { cva } from 'cva'
import { cx } from '#/utils/cva.config'

const avatarVariants = cva({
  base: 'flex items-center justify-center rounded-full bg-slate-600 text-lg text-white',
  variants: {
    size: {
      12: 'size-12',
      10: 'size-10',
      8: 'size-8 text-sm',
      6: 'size-6 text-xs',
    },
  },
  defaultVariants: {
    size: 12,
  },
})

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name?: string
  className?: string
}

export default function Avatar({ name, className, size }: AvatarProps) {
  const getInitials = () => {
    if (!name)
      return null

    const [firstName, lastName] = name.split(' ')
    return firstName && lastName
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`
      : firstName.charAt(0)
  }

  return (
    <div className={cx(
      avatarVariants({
        size,
        className,
      }),
    )}
    >
      {getInitials() ?? <Fallback />}
    </div>
  )
}

function Fallback() {
  return (
    <svg
      viewBox="0 0 128 128"
      color="#fff"
      width="100%"
      height="100%"
      opacity="80%"
    >
      <path
        fill="currentColor"
        d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
      />
      <path
        fill="currentColor"
        d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
      />
    </svg>
  )
}
