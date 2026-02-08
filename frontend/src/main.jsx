import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './store/store.js';
import axios from 'axios';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css'
import App from './App.jsx'

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
