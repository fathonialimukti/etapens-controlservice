import { exec, execSync } from "node:child_process"
import util from "node:util"
import { appDirectory } from "../constant/directories.js"

const Run = util.promisify( exec )

export const index = async ( req, res, next ) => {
    try {
        await Run( `
            killall -15 :${ req.body.port } && killall -9 :${ req.body.port }
            `, { shell: '/bin/bash'} )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}

 // (serve -s dist -p 10001&)