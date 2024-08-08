import type { VariantProps } from 'cva'
import { cva, cx } from '#/utils/cva.config'

const iconVariants = cva({
  variants: {
    name: {
      'warning-outline-rounded': 'icon-[material-symbols--warning-outline-rounded]',
      'close-small-outline-rounded': 'icon-[material-symbols--close-small-outline-rounded]',
      'location-on-outline': 'icon-[material-symbols--location-on-outline]',
      'lock-outline': 'icon-[material-symbols--lock-outline]',
      'lock-open-outline': 'icon-[material-symbols--lock-open-outline]',
      'list': 'icon-[material-symbols--list]',
      'map-outline': 'icon-[material-symbols--map-outline]',
      'forum-outline-rounded': 'icon-[material-symbols--forum-outline-rounded]',
      'calendar-today': 'icon-[material-symbols--calendar-today]',
      'progress-activity': 'icon-[material-symbols--progress-activity]',
    },
    size: {
      12: 'size-12',
      10: 'size-10',
      8: 'size-8',
      6: 'size-6',
      5: 'size-5',
      4: 'size-4',
    },
  },
  defaultVariants: {
    size: 8,
  },
})

export interface IconProps
  extends Omit<VariantProps<typeof iconVariants>, 'name'>,
  Required<Pick<VariantProps<typeof iconVariants>, 'name'>> {
  className?: string
}

export function Icon({ className, name, size, ...props }: IconProps) {
  return (
    <div
      className={cx(
        iconVariants({
          name,
          size,
          className,
        }),
      )}
      {...props}
    />
  )
}
