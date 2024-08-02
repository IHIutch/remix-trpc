import * as React from 'react'

import * as ReactAria from 'react-aria-components'
import { Icon } from './icon'
import { cx } from '#/utils/cva.config'

export function Menu(props: ReactAria.MenuTriggerProps) {
  return <ReactAria.MenuTrigger {...props} />
}
export interface MenuContentProps<T>
  extends Omit<ReactAria.PopoverProps, 'children' | 'style'>,
  ReactAria.MenuProps<T> {
  className?: string
  popoverClassName?: string
}

export function MenuContent<T extends object>({
  className,
  popoverClassName,
  ...props
}: MenuContentProps<T>) {
  return (
    <ReactAria.Popover
      className={cx(
        // Base
        'min-w-[150px] overflow-auto rounded-md border bg-white p-1 shadow dark:border-slate-700 dark:bg-slate-800',
        // Entering
        'entering:animate-in entering:fade-in',
        // Exiting
        'exiting:animate-in exiting:fade-in exiting:direction-reverse',
        // Top
        'placement-top:slide-in-from-bottom-2',
        // Bottom
        'placement-bottom:slide-in-from-top-2',
        popoverClassName,
      )}
      {...props}
    >
      <ReactAria.Menu className={cx('outline-none', className)} {...props} />
    </ReactAria.Popover>
  )
}

export function MenuItem({
  className,
  children,
  ...props
}: ReactAria.MenuItemProps) {
  return (
    <ReactAria.MenuItem
      className={cx(
        'group',
        'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-black outline-none transition-colors dark:text-white',
        // Hover
        'hover:bg-slate-100 dark:hover:bg-slate-700',
        // Focus
        'focus:bg-slate-100 dark:focus:bg-slate-700',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent',
        className,
      )}
      {...props}
    >
      {({ selectionMode }) => (
        <>
          {selectionMode === 'single'
            ? (
                <Icon
                  variant="warning-outline-rounded"
                  aria-hidden="true"
                  className="group-selected:visible invisible size-2 fill-current"
                  size={6}
                />
              )
            : selectionMode === 'multiple'
              ? (
                  <Icon
                    variant="warning-outline-rounded"
                    aria-hidden="true"
                    className="group-selected:visible invisible size-4"
                    size={6}
                  />
                )
              : null}
          {children}
        </>
      )}
    </ReactAria.MenuItem>
  )
}

export function MenuSection<T extends object>(props: ReactAria.SectionProps<T>) {
  return <ReactAria.Section {...props} />
}

export function MenuHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <ReactAria.Header
      className={cx(
        'px-2 py-1 text-sm font-medium text-slate-500 dark:text-slate-400',
        className,
      )}
      {...props}
    />
  )
}

export function MenuSeparator({
  className,
  ...props
}: ReactAria.SeparatorProps) {
  return (
    <ReactAria.Separator
      className={cx('-mx-1 my-1 border-t dark:border-slate-700', className)}
      {...props}
    />
  )
}
