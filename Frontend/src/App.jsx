import React from 'react'

import { Route, Routes } from 'react-router-dom'
import './App.css'
import ReelsPage from './Pages/ReelsPage'
import Login from './Pages/Login'
import Signup from './Pages/SignUp'
import UserProfilePage from './Pages/UserProfilePage'
import ReelUpload from './Pages/ReelUpload'
import EditProfile from './Pages/EditProfile'
import EditReel from './Pages/EditReel'
import ReelPage from './Pages/ReelPage'
import VerifyEmail from './Pages/VerifyEmail'
import Home from './Pages/Home'
import Navbar from './components/common/Navbar'

const App = () => {
  return (
    <div  >
      <div>
        <Navbar />
      </div>
      <Routes className="">
         <Route path="/" element={<Home />} />
        <Route path="/reels/:reelId" element={<ReelsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Verify-Email" element={<VerifyEmail />} />
        <Route path="/:username" element={<UserProfilePage />} />
        <Route path="/UploadReel" element={<ReelUpload />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/EditReel/:reelId" element={<EditReel />} />
         <Route path="/reel/:reelId" element={<ReelPage />} />
      </Routes></div>
  )
}

export default App