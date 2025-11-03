import react from 'react'
import reactDOM from 'react-dom/client'
import app from './App.jsx'
 function myapp(){
    const username="radhe radhe"
    return (
      <div>
        <chai/>

        <h1>custom app {username}</h1>
        <p>tear papar</p>
      </div>
    )
 }
 
reactDOM.createRoot(document.getElementById('root')).render(
  <react.StrictMode>
    <app/>
  </react.StrictMode>
)