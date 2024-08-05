import { type VariantProps, cva, cx } from 'cva'

const iconVariants = cva({
  variants: {
    variant: {
      'warning-outline-rounded': 'icon-[material-symbols--warning-outline-rounded]',
      'close-small-outline-rounded': 'icon-[material-symbols--close-small-outline-rounded]',
      'location-on-outline': 'icon-[material-symbols--location-on-outline]',
      'lock-outline': 'icon-[material-symbols--lock-outline]',
      'lock-open-outline': 'icon-[material-symbols--lock-open-outline]',
      'list': 'icon-[material-symbols--list]',
      'map-outline': 'icon-[material-symbols--map-outline]',
      'forum-outline-rounded': 'icon-[material-symbols--forum-outline-rounded]',
      'calendar-today': 'icon-[material-symbols--calendar-today]',
    },
    size: {
      12: 'size-12',
      10: 'size-10',
      8: 'size-8',
      6: 'size-6',
      5: 'size-5',
    },
  },
  defaultVariants: {
    size: 8,
  },
})

export interface IconProps
  extends Omit<VariantProps<typeof iconVariants>, 'variant'>,
  Required<Pick<VariantProps<typeof iconVariants>, 'variant'>> {
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
