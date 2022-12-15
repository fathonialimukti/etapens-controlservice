import express from 'express'
import * as c from '../controllers/project.js'
const projectRoute = express.Router()

projectRoute.post( '/create-webstatic', c.createWebStatic )
projectRoute.post( '/create-nodejs', c.createNodeJs )
projectRoute.post( '/update-webstatic', c.updateWebStatic )
projectRoute.post( '/update-nodejs', c.updateNodeJs )
projectRoute.post( '/delete', c.remove )
projectRoute.post( '/stop', c.stop )
// projectRoute.post( '/start', c.remove )
// projectRoute.post( '/status', c.remove )

export default projectRoute