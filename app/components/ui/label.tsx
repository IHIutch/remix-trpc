import * as ReactAria from 'react-aria-components'
import { cx } from '#/utils/cva.config'

export function Label({ className, ...props }: ReactAria.LabelProps) {
  return (
    <ReactAria.Label
      className={cx(
        'mb-1 mr-3 block font-medium text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-40 dark:text-white',
        className,
      )}
      {...props}
    />
  )
}
