import React from 'react'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Home = React.lazy(() => import('./pages/Home'))

const Creator = React.lazy(() => import('./pages/Creator'))
const Creators = React.lazy(() => import('./pages/Creators'))
const Videography = React.lazy(() => import('./pages/Videography'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))



const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', element: Home },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/creator/:id', name: 'Creator', element: Creator},
  { path: '/creators', name: 'Creators', element: Creators },
  { path: '/videography', name: 'Videography', element: Videography },
  
]

export default routes
