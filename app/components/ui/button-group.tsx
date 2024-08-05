import { ToggleButtonContext } from 'react-aria-components'

interface ButtonGroupProps {
  children?: React.ReactNode
  isDisabled?: boolean
}

export function ButtonGroup({ children, isDisabled = false }: ButtonGroupProps) {
  return (
    <div>
      {/* eslint-disable-next-line react/no-unstable-context-value */}
      <ToggleButtonContext.Provider value={{ isDisabled }}>
        {children}
      </ToggleButtonContext.Provider>
    </div>
  )
}
