import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorMiddleware from './middlewares/error.js'
import indexRoute from './routes/index.js'

const app = express()

app.use( cors() )
app.use( bodyParser.urlencoded( { extended: false } ) )
app.use( bodyParser.json() )

app.use( '/', indexRoute)

app.use( '/project', studentRoute )
app.use( '/backend', adminRoutes )
app.use( '/database', lecturerRoute )

app.use( errorMiddleware )

app.listen( 5000, () =>
    console.log( `🚀 Server ready at: http://localhost:5000 ⭐️ Good luck` ),
)