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

        await execSync( `
            mkdir -p ${ directory }
            git clone ${ req.body.sourceCode } ${ directory }
            cd ${ directory }

            source ${ process.env.NVM_DIR }/nvm.sh
            nvm use ${ req.body.runtimeVersion }
            pnpm i
            pnpm build
            pnpm i -P 

            (PORT=${ port } pnpm start&)
            ` , { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const update = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id ) next( 'data missing' )

        const port = targetPort( req.body.id )
        const directory = targetDirectory( req.body.username )

        await execSync( `
            kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })

            cd ${ directory }
            git pull

            source ${ process.env.NVM_DIR }/nvm.sh
            nvm use ${ req.body.runtimeVersion }
            pnpm i
            pnpm build
            pnpm i -P

            cd ${ directory }
            (PORT=${ port } pnpm start&)
            ` , { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const stop = async ( req, res, next ) => {
    try {
        if ( !req.body.id ) next( 'data missing' )

        const port = targetPort( req.body.id )
        const { stdout, stderr } = await Run( `
            kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })
            `, { shell: '/bin/bash' } )

        if ( stderr ) throw new Error(stderr)
        res.status( 200 ).json( { message: stdout } )
    } catch ( error ) {
        next( error )
    }
}


export const remove = async ( req, res, next ) => {
    try {
        if ( !req.body.id || !req.body.username ) throw new Error( 'data missing' )
        const port = targetPort( req.body.id )

        const directory = targetDirectory( req.body.username )

        await execSync( `
            kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })
            rm -rf ${ directory }
            `, { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { message: stdout, error: stderr } )
    } catch ( error ) {
        next( error )
    }
}