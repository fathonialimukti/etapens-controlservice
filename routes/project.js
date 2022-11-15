import express from 'express'
import * as c from '../controllers/project.js'
const projectRoute = express.Router()

projectRoute.post( '', c.create )
projectRoute.patch( '', c.update )
projectRoute.delete( '', c.remove )

export default projectRoute