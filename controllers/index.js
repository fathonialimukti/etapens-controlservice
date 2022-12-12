import { exec, execSync, spawn } from "node:child_process"
import util from "node:util"
import { appDirectory } from "../constant/directories.js"

const Run = util.promisify( exec )

export const index = async ( req, res, next ) => {
    try {
        // await execSync( `
        //      kill -15 $(lsof -t -i :9898)
        // `, { shell: '/bin/bash', stdio:'inherit'} )

        // res.status( 200 ).json( { message: "OK" } )

        const npm = spawn( 'pnpm', [ 'start' ], {
            detached: true,
        } )

        npm.unref();

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}

 // (serve -s dist -p 10001&)