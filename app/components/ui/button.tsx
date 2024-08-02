import { type VariantProps, cva, cx } from 'cva'
import * as ReactAria from 'react-aria-components'

// eslint-disable-next-line react-refresh/only-export-components
export const button = cva({
  base: [
    'inline-flex items-center justify-center rounded-md font-medium outline-none transition-colors',
    // Focus
    'focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-blue-300',
    // Disabled
    'disabled:pointer-events-none disabled:opacity-40 aria-disabled:opacity-40',
  ],
  variants: {
    colorScheme: {
      blue:
        'bg-blue-600 text-white open:bg-blue-600 hover:bg-blue-800 dark:bg-blue-300 dark:text-black dark:open:bg-blue-300 dark:hover:bg-blue-200',
    },
    size: {
      lg: 'h-12 px-6 text-lg',
      md: 'h-10 px-4 text-base',
      sm: 'h-8 px-3 text-sm',
      xs: 'h-6 px-2 text-xs',
    },
  },
  defaultVariants: {
    colorScheme: 'blue',
    size: 'md',
  },
})

export interface ButtonProps
  extends ReactAria.ButtonProps,
  VariantProps<typeof button> {
  className?: string
}

export function Button({
  className,
  colorScheme,
  size,
  ...props
}: ButtonProps) {
  return (
    <ReactAria.Button
      className={cx(
        button({
          colorScheme,
          size,
          className,
        }),
      )}
      {...props}
    />
  )
}
