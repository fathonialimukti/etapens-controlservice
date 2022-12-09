import { exec, execSync } from "node:child_process"
import util from "node:util"
import pids from 'port-pid'
import { appDirectory } from "../constant/directories.js"

const Run = util.promisify( exec )

export const index = async ( req, res, next ) => {
    try {
        // await execSync( `
        // (PORT=9856 pnpm start&)
        // `, { shell: '/bin/bash', stdio:'ignore'} )
        
        const processPid = await pids( 20001 )
        const pid = processPid.all.pop()
        await Run( `
            kill -15 ${ pid } && kill -9 ${ pid }
            `, { shell: '/bin/bash'} )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}

 // (serve -s dist -p 10001&)