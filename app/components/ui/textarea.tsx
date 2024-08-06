import { type VariantProps, cva, cx } from 'cva'
import * as ReactAria from 'react-aria-components'

const textareaVariants = cva({
  base: [
    'flex min-h-20 w-full border border-slate-300 bg-transparent placeholder:text-slate-400',
    // Focus
    'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
    // Dark
    'dark:border-slate-700 dark:text-slate-50 dark:focus:ring-blue-600 dark:focus:ring-offset-slate-900',
    // Disabled
    'disabled:cursor-not-allowed disabled:opacity-40',
    // Invalid
    'invalid:border-red-600 dark:invalid:border-red-400',
  ],
  variants: {
    size: {
      lg: 'rounded-lg px-4 py-2 text-lg',
      md: 'rounded-md px-4 py-2 text-base',
      sm: 'rounded px-3 py-2 text-sm',
      xs: 'rounded p-2 text-xs',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface TextareaProps
  extends Omit<ReactAria.TextAreaProps, 'size'>,
  VariantProps<typeof textareaVariants> {
  className?: string
}

export function Textarea({ className, size, ...props }: TextareaProps) {
  return (
    <ReactAria.TextArea
      className={cx(
        textareaVariants({
          size,
          className,
        }),
      )}
      {...props}
    />
  )
}
