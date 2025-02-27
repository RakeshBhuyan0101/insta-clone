import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SuggestedUsers from './SuggestedUsers'

const RightSideBar = () => {
  const {user} =useSelector(state => state.auth)
  return (
    <div className=' my-10 pr-32 border  w-1/6 '>
      <div className='flex items-center gap-2 border w-full'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilepic} alt="post_image" />
            <AvatarFallback> CN </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSideBar