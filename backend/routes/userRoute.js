import express from 'express'
import { editProfile, followUnfollow, getProfile, getSuggestedusers, loginUser, logout, registerUser } from '../controllers/user.controller.js'
import {isAuthenticated} from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'

const router = express.Router()

router.route('/signup').post(registerUser)
router.route('/signin').post(loginUser)
router.route('/logout').get(logout)
router.route('/:id/profile').get( isAuthenticated , getProfile)
router.route ('/profile/edit').post(isAuthenticated , upload.single('profilepic') ,editProfile)
router.route('/suggested').get(isAuthenticated , getSuggestedusers)
router.route ('/followunfollow/:id').get(isAuthenticated , followUnfollow)
export default router
