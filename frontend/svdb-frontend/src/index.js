import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.scss'; // Import the Less file
import { getCreatorStatsFn } from "./services/creatorApi.ts";
import './sass/antd.module.scss'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store';
import { fetchAndCacheAllData } from './services/cacheApi.ts'; // Import your channelService




async function fetchAndCacheData() {
  // Fetch data and cache logic here
  let params = new URLSearchParams();
  params.append("channels", []);

  await fetchAndCacheAllData(params);
}

fetchAndCacheData().then(() => {
  createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>,
  )
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
