import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'

//main.htmlのrootの場所に描写
createRoot(document.getElementById('root')).render(//安全チェック
  <StrictMode> 
    <App />
  </StrictMode>,
)
