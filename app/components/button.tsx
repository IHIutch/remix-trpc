import { type VariantProps, cva, cx } from 'cva'

export const button = cva({
  base: [
    'inline-flex items-center justify-center rounded-md font-medium outline-none transition-colors',
    // Focus
    // 'focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
    // Disabled
    // 'disabled:pointer-events-none disabled:opacity-40',
  ],
  variants: {
    // variant: {
    //   solid:
    //     'bg-slate-900 text-white open:bg-slate-100 hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:open:bg-slate-800 dark:hover:bg-slate-200',
    // },
    size: {
      lg: 'h-12 px-6 text-lg',
      md: 'h-10 px-4 text-base',
      sm: 'h-8 px-3 text-sm',
      xs: 'h-6 px-2 text-xs',
    },
  },
  defaultVariants: {
    // variant: 'solid',
    size: 'md',
  },
})

export interface ButtonProps
  extends VariantProps<typeof button> {
  className?: string
}

export function Button({
  className,
  // variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cx(
        button({
        //   variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  )
}
