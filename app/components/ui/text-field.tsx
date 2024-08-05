import * as ReactAria from 'react-aria-components'
import { cx } from '#/utils/cva.config'

export function TextField({
  className,
  ...props
}: ReactAria.TextFieldProps) {
  return <ReactAria.TextField className={cx('w-full', className)} {...props} />
}

export function TextFieldDescription({
  className,
  ...props
}: ReactAria.TextProps) {
  return (
    <ReactAria.Text
      elementType="div"
      slot="description"
      className={cx(
        'mt-2 text-sm text-slate-500 dark:text-slate-400',
        className,
      )}
      {...props}
    />
  )
}

export function TextFieldErrorMessage({
  className,
  ...props
}: ReactAria.TextProps) {
  return (
    <ReactAria.Text
      elementType="div"
      slot="errorMessage"
      className={cx('mt-2 text-sm text-red-600 dark:text-red-400', className)}
      {...props}
    />
  )
}
