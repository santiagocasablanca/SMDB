import React from 'react'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Home = React.lazy(() => import('./pages/Home'))

const Creator = React.lazy(() => import('./pages/Creator'))
const Creators = React.lazy(() => import('./pages/Creators'))
const Channels = React.lazy(() => import('./pages/Channels'))
const Channel = React.lazy(() => import('./pages/Channel'))
const Videography = React.lazy(() => import('./pages/Videography'))
const Shorts = React.lazy(() => import('./pages/Shorts'))
const About = React.lazy(() => import('./pages/About'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', element: Home },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/creator/:id', name: 'Creator', element: Creator },
  { path: '/creators', name: 'Creators', element: Creators },
  { path: '/channels', name: 'Channels', element: Channels },
  { path: '/channel/:id', name: 'Channel', element: Channel },
  { path: '/videography', name: 'Videography', element: Videography },
  { path: '/shorts', name: 'Shorts', element: Shorts },
  { path: '/about', name: 'About', element: About },
]

export default routes
