import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from "react-redux"
import rootReducer from './reducer';




const store = configureStore({
  reducer: rootReducer,
})

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <StrictMode>
      <BrowserRouter>
        <App />
         <Toaster/>
      </BrowserRouter>
    </StrictMode>
  </Provider>,
)
