import express from 'express'
import { index } from '../controllers/index.js'
const indexRoute = express.Router()

indexRoute.post( '', index )

export default indexRoute