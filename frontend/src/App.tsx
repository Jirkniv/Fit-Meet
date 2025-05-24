import './App.css'
import Login from './pages/login.tsx'
import Register from './pages/register.tsx'
import Home from './pages/home.tsx'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { ActivityProvider } from './context/activityContext.tsx'
import { ActivityTypesProvider } from './context/activityTypeContext.tsx'
import Profile from './pages/profile.tsx'
import UpdatePerfil from './pages/UpdatePerfil.tsx'
import ActivityByTypes from './pages/activityByType.tsx'
//import { AuthProvider } from './context/authContext.tsx'

function App() {

  return (
   // <AuthProvider>
      <ActivityProvider>
        <ActivityTypesProvider>
          <BrowserRouter basename="/my-app">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home/>}/>
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/profile/update' element={<UpdatePerfil/>}/>
             <Route path="/activityByType" element={<ActivityByTypes/>}/>
            </Routes>
          </BrowserRouter>
        </ActivityTypesProvider>
      </ActivityProvider>
 //   </AuthProvider>
  )
}

export default App
