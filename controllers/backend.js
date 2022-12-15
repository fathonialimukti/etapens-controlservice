import { exec, execSync } from "node:child_process"
import util from "node:util"
import { appDirectory } from '../constant/directories.js'
import { hostIp } from "../constant/host.js"

const Run = util.promisify( exec )

const targetDirectory = ( username ) => `${ appDirectory }/${ username }/backend`
const targetPort = ( id ) => 20000 + parseInt( id )

export const create = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id || !req.body.runtimeVersion ) throw new Error( 'data missing' )

        const directory = targetDirectory( req.body.username )
        const port = targetPort( req.body.id )

        const { stderr } = await Run( `
            mkdir -p ${ directory } ;
            git clone ${ req.body.sourceCode } ${ directory } ;
            cd ${ directory } ;

            nvm use ${ req.body.runtimeVersion } ;
            pnpm i ;
            pnpm build ;
            pnpm i -P `)
        
        if ( stderr ) throw new Error( stderr )

        await execSync( `
            cd ${ directory } ;
            (PORT=${ port } pnpm start&)
            ` , { shell: '/bin/bash', stdio: 'ignore' } )

        res.status( 200 ).json( { url: `${ hostIp }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const update = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id ) throw new Error( 'data missing' )

        const port = targetPort( req.body.id )
        await execSync( `kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })`, { shell: '/bin/bash', stdio: 'inherit' } )
        const directory = targetDirectory( req.body.username )

        const { stderr } = await Run( `
                cd ${ directory } ;
                git pull ;

                nvm use ${ req.body.runtimeVersion } ;
                pnpm i ;
                pnpm build ;
                pnpm i -P`)
        if ( stderr ) throw new Error( stderr )

        await execSync( `
                cd ${ directory } ;
                (PORT=${ port } pnpm start&)
                ` , { shell: '/bin/bash', stdio: 'ignore' } )

        res.status( 200 ).json( { url: `${ hostIp }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const stop = async ( req, res, next ) => {
    try {
        if ( !req.body.id ) throw new Error( 'data missing' )

        const port = targetPort( req.body.id )
        const { stdout,stderr } = await Run( `kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })`, { shell: '/bin/bash' } )

        if ( stderr ) throw new Error(stderr)
        res.status( 200 ).json( { message: stdout } )
    } catch ( error ) {
        next( error )
    }
}


export const remove = async ( req, res, next ) => {
    try {

        const port = targetPort( req.body.id )
        const processPid = await pids( port )
        const pid = processPid.all.pop()
        await stopProcess( pid )

        const directory = targetDirectory( req.body.username )

        await execSync( `rm -rf ${ directory }`, { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { message: stdout, error: stderr } )
    } catch ( error ) {
        next( error )
    }
}