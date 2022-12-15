import { exec, execSync } from "node:child_process"
import util from "node:util"

const Run = util.promisify( exec )

const targetDirectory = ( username ) => `${ process.env.APPS_DIRECTORY }/${ username }/backend`
const targetPort = ( id ) => 20000 + parseInt( id )

export const create = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id || !req.body.runtimeVersion ) next( 'data missing' )

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
        
        if ( stderr ) next( stderr )

        await execSync( `
            cd ${ directory } ;
            (PORT=${ port } pnpm start&)
            ` , { shell: '/bin/bash', stdio: 'ignore' } )

        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const update = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id ) next( 'data missing' )

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
        if ( stderr ) next( stderr )

        await execSync( `
                cd ${ directory } ;
                (PORT=${ port } pnpm start&)
                ` , { shell: '/bin/bash', stdio: 'ignore' } )

        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const stop = async ( req, res, next ) => {
    try {
        if ( !req.body.id ) next( 'data missing' )

        const port = targetPort( req.body.id )
        const { stdout,stderr } = await Run( `kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })`, { shell: '/bin/bash' } )

        if ( stderr ) next(stderr)
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