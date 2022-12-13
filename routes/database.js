import express from 'express'
import * as c from '../controllers/database.js'
const databaseRoute = express.Router()

databaseRoute.post( '/create', c.create )
// databaseRoute.patch( '', c.update )
// databaseRoute.delete( '', c.remove )

export default databaseRoute