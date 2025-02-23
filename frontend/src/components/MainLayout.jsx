import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidBar from './LeftSidBar'


export const MainLayout = () => {
  return (
    <div>
        <LeftSidBar/>
        <div>
            <Outlet/>
        </div>
    </div>
  )
}
