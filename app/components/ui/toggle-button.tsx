import type { VariantProps } from 'cva'
import { cva, cx } from 'cva'
import * as ReactAria from 'react-aria-components'

const toggleButton = cva({
  base: [
    'inline-flex items-center justify-center border border-gray-300 font-medium outline-none transition-colors first:rounded-s-md first:border-e-0 last:rounded-e-md last:border-s-0',
    // Focus
    'focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-blue-300',
    // Disabled
    'disabled:pointer-events-none disabled:opacity-40 aria-disabled:opacity-40',
  ],
  variants: {
    colorScheme: {
      blue:
          'bg-white text-black hover:bg-blue-800 hover:text-white aria-pressed:bg-blue-600 aria-pressed:text-white dark:bg-blue-300 dark:text-black dark:open:bg-blue-300 dark:hover:bg-blue-200',
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
  extends ReactAria.ToggleButtonProps,
  VariantProps<typeof toggleButton> {
  className?: string
}

export function ToggleButton({
  className,
  colorScheme,
  size,
  ...props
}: ButtonProps) {
  return (
    <ReactAria.ToggleButton
      className={cx(
        toggleButton({
          colorScheme,
          size,
          className,
        }),
      )}
      {...props}
    />
  )
}
