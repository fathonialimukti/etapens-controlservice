const errorMiddleware = ( error, req, res, next ) => {
    try {
        const status = error.status >= 100 ? error.status : 500
        const message = error.message || 'Something went wrong'

        console.log( `[${ req.method }] ${ req.path } >> StatusCode:: ${ status }, Message:: ${ message }` )
        res.status( status ).json( { message } )
    } catch ( error ) {
        next( error )
    }
}

export default errorMiddleware