import express from 'express'
import * as c from '../controllers/index.js'

const indexRoute = express.Router()

indexRoute.post( '', c.index )

export default indexRoute