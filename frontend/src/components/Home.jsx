import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import getAllPost from '@/hooks/getAllPost'
import getSuggestedUsers from '@/hooks/getSuggestedUsers'

const Home = () => {
  getAllPost()
  getSuggestedUsers()
  return (
    <div className='flex '>
      <div className='flex-grow'>
      <Feed/>
      <Outlet/>
      </div>
      <RightSideBar/>
    </div>
  )
}

export default Home