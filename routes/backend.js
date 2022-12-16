import express from 'express'
import * as c from '../controllers/backend.js'
const backendRoute = express.Router()

backendRoute.post( '/create', c.create )
backendRoute.post( '/update', c.update )
backendRoute.post( '/stop', c.stop )
backendRoute.post( '/start', c.start )
backendRoute.post( '/delete', c.remove )
// backendRoute.post( '/status', c.remove )

export default backendRoute