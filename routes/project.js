import express from 'express'
import * as c from '../controllers/project.js'
const projectRoute = express.Router()

projectRoute.post( '/create', c.create )
projectRoute.post( '/update', c.update )
projectRoute.post( '/delete', c.remove )
projectRoute.post( '/start', c.remove )
projectRoute.post( '/stop', c.remove )
projectRoute.post( '/status', c.remove )

export default projectRoute