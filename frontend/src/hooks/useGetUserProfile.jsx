

import { setSuggestedUsers, setUserProfile } from '@/redux/features/authSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetUserPrfile = (userId) => {
  const dispatch = useDispatch( )
  useEffect( () => {
    const ftechUserProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/v1/user/${userId}/profile`, {withCredentials : true})
            if (res.data.success) {
                dispatch(setUserProfile(res.data.user))
            }
        } catch (error) {
            console.log(error)
        }
    }

    ftechUserProfile()
  },[userId])
}

export default useGetUserPrfile