import { execSync } from "node:child_process"
import { appDirectory } from '../constant/directories.js'
import { hostIp } from "../constant/host.js"

const targetDirectory = ( username ) => `${ appDirectory }/${ username }/frontend`
const targetPort = ( id ) => 10000 + parseInt( id )

export const create = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id || !req.body.type ) throw new Error( 'data missing' )
        if ( req.body.type == 'NodeJs' && !req.body.runtimeVersion ) throw new Error( 'data missing' )

        const directory = targetDirectory( req.body.username )
        const port = targetPort( req.body.id )

        if ( req.body.type == 'NodeJs' ) {
            await execSync( `
                mkdir -p ${ directory }
                git clone ${ req.body.sourceCode } ${ directory }
                cd ${ directory }

                nvm use ${ req.body.runtimeVersion }
                pnpm i
                pnpm build
                pnpm i -P

                (PORT=${ port } pnpm start&)

                ` , { shell: '/bin/bash', stdio: 'inherit' } )
        } else if ( req.body.type == 'WebStatic' ) {
            await execSync( `
                mkdir -p ${ directory }
                git clone --depth 1 --no-checkout ${ req.body.sourceCode } ${ directory }
                cd ${ directory }

                git sparse-checkout set dist
                git checkout
                (serve -s dist -p ${ port }&)

                ` , { shell: '/bin/bash', stdio: 'inherit' } )
        }

        res.status( 200 ).json( { url: `${ hostIp }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const update = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id || !req.body.type ) throw new Error( 'data missing' )
        if ( req.body.type == 'NodeJs' && !req.body.runtimeVersion ) throw new Error( 'data missing' )

        const port = targetPort( req.body.id )
        await execSync( `killall -15 :${ port } && killall -9 :${ port } `, { shell: '/bin/bash', stdio: 'inherit' } )

        const directory = targetDirectory( req.body.username )
        
        if ( req.body.type == 'NodeJs' ) {
            await execSync( `
                cd ${ directory }
                git pull

                nvm use ${ req.body.runtimeVersion }
                pnpm i
                pnpm build
                pnpm i -P

                (PORT=${ port } pnpm start&)

                ` , { shell: '/bin/bash', stdio: 'inherit' } )
        } else if ( req.body.type == 'WebStatic' ) {
            await execSync( `
                cd ${ directory }
                git pull

                (serve -s dist -p ${ port }&)
                
                ` , { shell: '/bin/bash', stdio: 'inherit' } )
        }

        res.status( 200 ).json( { url: `${ hostIp }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const stop = async ( req, res, next ) => {
    try {
        if ( !req.body.id ) throw new Error( 'data missing' )

        const port = targetPort( req.body.id )
        await execSync( `killall -15 :${ port } && killall -9 :${ port } `, { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}

export const remove = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.id ) throw new Error( 'data missing' )

        const port = targetPort( req.body.id )
        await execSync( `killall -15 :${ port } && killall -9 :${ port } `, { shell: '/bin/bash', stdio: 'inherit' } )

        const directory = targetDirectory( req.body.username )

        await execSync( `rm -rf ${ directory } `, { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}