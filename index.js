import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorMiddleware from './middlewares/error.js'
import indexRoute from './routes/index.js'
import frontendRoute from './routes/frontend.js'
import backendRoute from './routes/backend.js'
import databaseRoute from './routes/database.js'
import https from 'https'
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()

const options = {
    key: fs.readFileSync( './private.key' ),
    cert: fs.readFileSync( './certificate.crt' )
}
app.use( cors() )
app.use( bodyParser.urlencoded( { extended: false } ) )
app.use( bodyParser.json() )

app.use( '', indexRoute)

app.use( '/frontend', frontendRoute )
app.use( '/backend', backendRoute )
app.use( '/database', databaseRoute )

app.use( errorMiddleware )

const port = process.env.PORT || 5000

app.listen( port, () => { console.log( "app listen on port " + port ) } )
// https.createServer( options, app ).listen( port )