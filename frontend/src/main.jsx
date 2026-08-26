
import { createRoot } from 'react-dom/client' 
//Iska kaam hai HTML ke kisi element ko React application ka root/container banana.
import { BrowserRouter } from "react-router-dom";
//BrowserRouter React application mein routing/navigation enable karta hai
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(

  <BrowserRouter>

    <App />

  </BrowserRouter>

)


















//Browser mein React application ko start/mount karne ka kaam main.jsx karta hai.