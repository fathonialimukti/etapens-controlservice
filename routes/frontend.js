import express from 'express'
import * as c from '../controllers/frontend.js'
const frontendRoute = express.Router()

frontendRoute.post( '/create-webstatic', c.createWebStatic )
frontendRoute.post( '/create-nodejs', c.createNodeJs )
frontendRoute.post( '/update-webstatic', c.updateWebStatic )
frontendRoute.post( '/update-nodejs', c.updateNodeJs )
frontendRoute.post( '/start-webstatic', c.startWebStatic )
frontendRoute.post( '/start-nodejs', c.startNodeJs )
frontendRoute.post( '/stop', c.stop )
frontendRoute.post( '/delete', c.remove )
// frontendRoute.post( '/status', c.remove )

export default frontendRoute