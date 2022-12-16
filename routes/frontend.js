import express from 'express'
import * as c from '../controllers/frontend.js'
const frontendRoute = express.Router()

frontendRoute.post( '/create-webstatic', c.createWebStatic )
frontendRoute.post( '/create-nodejs', c.createNodeJs )
frontendRoute.post( '/update-webstatic', c.updateWebStatic )
frontendRoute.post( '/update-nodejs', c.updateNodeJs )
frontendRoute.post( '/delete', c.remove )
frontendRoute.post( '/stop', c.stop )
// frontendRoute.post( '/start', c.remove )
// frontendRoute.post( '/status', c.remove )

export default frontendRoute