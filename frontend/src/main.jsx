import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

import './Styles/Button.css'
import './Styles/FileDrop.css'
import './Styles/FormContainer.css'
import './Styles/Header.css'
import './Styles/Input.css'
import './Styles/Login.css'
import './Styles/Post.css'
import './Styles/PostCreation.css'
import './Styles/User.css'
import './Styles/ErrorMessage.css'

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
