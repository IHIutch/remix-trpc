import { type VariantProps, cva, cx } from 'cva'

const iconVariants = cva({
  variants: {
    variant: {
      'warning-outline-rounded': 'icon-[material-symbols--warning-outline-rounded]',
    },
    size: {
      12: 'size-12',
      10: 'size-10',
      8: 'size-8',
      6: 'size-6',
    },
  },
})

export interface IconProps extends VariantProps<typeof iconVariants> {
  className?: string
}

export function Icon({ className, variant, size, ...props }: IconProps) {
  return (
    <div
      className={cx(
        iconVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  )
}
