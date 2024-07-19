import { Link } from '@remix-run/react'

export default function Navbar() {
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
              {navItemsRight.map(link => (
                <Link
                  to={link.href}
                  key={link.href}
                  className="hidden md:inline"
                >
                  {link.name}
                </Link>
              ))}
              <CreateReportButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateReportButton() {
  return (
    <Link to="/create-report" className="flex h-10 items-center rounded-md bg-blue-600 px-4 font-medium text-white">Create Report</Link>
  )
}
