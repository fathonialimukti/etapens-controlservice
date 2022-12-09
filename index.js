import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorMiddleware from './middlewares/error.js'
import indexRoute from './routes/index.js'
import projectRoute from './routes/project.js'
import backendRoute from './routes/backend.js'
import databaseRoute from './routes/database.js'

const app = express()

app.use( cors() )
app.use( bodyParser.urlencoded( { extended: false } ) )
app.use( bodyParser.json() )

app.use( '', indexRoute)

app.use( '/project', projectRoute )
app.use( '/backend', backendRoute )
app.use( '/database', databaseRoute )

app.use( errorMiddleware )

const port = process.env.PORT || 5000

app.listen( port, () =>
    console.log( `🚀 Server ready at: http://localhost:${port} ⭐️ Good luck` ),
)