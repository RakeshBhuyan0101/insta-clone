


import { setSuggestedUsers } from '@/redux/features/authSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const getSuggestedUsers = () => {
  const dispatch = useDispatch( )
  useEffect( () => {
    const fetchAllUsers = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/v1/user/suggested", {withCredentials : true})
            if (res.data.success) {
                dispatch(setSuggestedUsers(res.data.users))
            }
        } catch (error) {
            console.log(error)
        }
    }

    fetchAllUsers()
  },[])
}

export default getSuggestedUsers