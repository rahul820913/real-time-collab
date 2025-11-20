import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from "./context/ProjectContext";
import { RunCodeContextProvider } from "./context/RunCodeContext";
import { SocketProvider } from "./context/SocketContext";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
  <SocketProvider>
  <AuthProvider> 
    
      <RunCodeContextProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </RunCodeContextProvider>
    
  </AuthProvider> 
  </SocketProvider>
</BrowserRouter>

)
