import { Link } from '@remix-run/react'
import * as ReactAria from 'react-aria-components'
import Avatar from './ui/avatar'
import { Menu, MenuContent, MenuItem } from './ui/dropdown'
import { button } from './ui/button'
import { useUser } from '#/utils/functions/user'

export default function Navbar() {
  const user = useUser()
  const navItemsLeft = [
    {
      name: 'Reports',
      href: '/',
    },
    // {
    //   name: 'Alerts',
    //   path: '/alerts',
    // },
  ]

  const navItemsRight = [
    {
      name: 'Log In',
      href: '/log-in',
    },
    {
      name: 'Sign Up',
      href: '/sign-up',
    },
  ]

  return (
    <div className="fixed inset-0 z-10 h-16 bg-white shadow-sm">
      <div className="mx-auto flex size-full max-w-screen-xl items-center px-4">
        <div className="flex w-full items-center">
          <div>
            <Link to="/" className="text-lg font-bold">Buffalo 311</Link>
          </div>
          <div className="ml-12 flex grow">
            <div className="hidden items-center gap-4 md:flex">
              {navItemsLeft.map(link => (
                <Link
                  to={link.href}
                  key={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-6">
              {user
                ? null
                : navItemsRight.map(link => (
                  <Link
                    to={link.href}
                    key={link.href}
                    className="hidden md:inline"
                  >
                    {link.name}
                  </Link>
                ))}
              <Link to="/create-report" className={button()}>Create Report</Link>
              {user
                ? (
                    <Menu>
                      <ReactAria.Button>
                        <Avatar name={`${user.firstName} ${user.lastName}`} />
                      </ReactAria.Button>
                      <MenuContent placement="bottom end">
                        <MenuItem href="/profile">My Reports</MenuItem>
                        <MenuItem href="/settings">Settings</MenuItem>
                        <MenuItem id="logout">Log Out</MenuItem>
                      </MenuContent>
                    </Menu>
                  )
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
