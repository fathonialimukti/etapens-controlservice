import { exec, execSync } from "node:child_process"
import util from "node:util"
import { childProcessLog } from "../utils/log.js"

const Run = util.promisify( exec )
const targetDirectory = ( username ) => `${ process.env.APPS_DIRECTORY }/${ username }/frontend`
const targetPort = ( id ) => 10000 + parseInt( id )

export const index = async ( req, res, next ) => {
    try {
        // await execSync( `
        //     kill -15 $(lsof -t -i :10011)
        // `, { shell: '/bin/bash', stdio: childProcessLog } )

        // if ( !req.body.username || !req.body.sourceCode || !req.body.id || !req.body.type ) throw new Error( 'data missing' )
        // const directory = targetDirectory( req.body.username )
        // const port = targetPort( req.body.id )

        // await execSync( `
        //     mkdir -p ${ directory }
        //     git clone --depth 1 --no-checkout ${ req.body.sourceCode } ${ directory }
        //     cd ${ directory }

        //     git sparse-checkout set dist
        //     git checkout
        //     cd ${ directory }
        //     (serve -s dist -p ${ port }&)
        //     ` , { shell: '/bin/bash', stdio: childProcessLog } )

        console.log( process.env.NVM_DIR )
        await execSync( `
            source ${ process.env.NVM_DIR }/nvm.sh
            nvm use 18
        `, {
            shell: '/bin/bash',
            stdio: childProcessLog
        } )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}

 // (serve -s dist -p 10001&)