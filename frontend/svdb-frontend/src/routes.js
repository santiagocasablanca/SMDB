import React from 'react'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Compare = React.lazy(() => import('./pages/Compare'))
const Creator = React.lazy(() => import('./pages/Creator'))
const Creators = React.lazy(() => import('./pages/Creators'))
const Videography = React.lazy(() => import('./pages/Videography'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))



const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/creator', name: 'Creator', element: Creator, exact: true },
  { path: '/creators', name: 'Creators', element: Creators, exact: true },
  { path: '/compare', name: 'Compare', element: Compare, exact: true },
  { path: '/videography', name: 'Videography', element: Videography, exact: true },
 
  
]

export default routes
