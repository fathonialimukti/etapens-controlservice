import express from 'express'
import * as c from '../controllers/backend.js'
const backendRoute = express.Router()

backendRoute.post( '', c.create )
backendRoute.patch( '', c.update )
backendRoute.delete( '', c.remove )

export default backendRoute