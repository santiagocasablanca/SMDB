import React from 'react'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Home = React.lazy(() => import('./pages/Home'))

const Creator = React.lazy(() => import('./pages/Creator'))
const Creators = React.lazy(() => import('./pages/Creators'))
const Channels = React.lazy(() => import('./pages/Channels'))
const Channel = React.lazy(() => import('./pages/Channel'))
// const DeprecatedVideography = React.lazy(() => import('./pages/Videography'))
const VideoPage = React.lazy(() => import('./pages/VideoPage'))
const Shorts = React.lazy(() => import('./components/videography/ShortsPage'))
const About = React.lazy(() => import('./pages/About'))
const Display = React.lazy(() => import('./pages/Display'))
const CharityMatch = React.lazy(() => import('./pages/CharityMatch'))

const Videography = React.lazy(() => import('./components/videography/VideographyPage'))
const VideoGameOnePage = React.lazy(() => import('./components/videoGameOne/VideoGameOne'))
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
  // { path: '/videography2', name: 'Videography2', element: DeprecatedVideography },
  { path: '/videography', name: 'Videography', element: Videography },
  { path: '/video/:id', name: 'Video', element: VideoPage },
  { path: '/shorts', name: 'Shorts', element: Shorts },
  { path: '/vikkStreak', name: 'VikkStreak', element: Display },
  { path: '/charityMatch', name: 'SDMN Charity Match', element: CharityMatch },
  { path: '/game', name: 'SDMN Video Game', element: VideoGameOnePage },
  { path: '/about', name: 'About', element: About },
]

export default routes
