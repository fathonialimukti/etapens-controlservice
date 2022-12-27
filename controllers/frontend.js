import { exec, execSync } from "node:child_process"
import util from "node:util"

// const Run = util.promisify( exec )

const targetDirectory = ( username ) => `${ process.env.APPS_DIRECTORY }/${ username }/frontend`
const targetPort = ( id ) => 10000 + parseInt( id )

export const createWebStatic = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id ) next( 'data missing' )

        console.log(req.body);

        const directory = targetDirectory( req.body.username )
        const port = targetPort( req.body.id )

        await execSync( `
            mkdir -p ${ directory }
            git clone --depth 1 --no-checkout ${ req.body.sourceCode } ${ directory }
            cd ${ directory }

            git sparse-checkout set dist
            git checkout
            cd ${ directory }
            (serve -s dist -p ${ port } &)
            ` , { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const createNodeJs = async ( req, res, next ) => {
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

            cd ${ directory }
            (PORT=${ port } pnpm start&)
            `, { shell: '/bin/bash', stdio: 'inherit' } )


        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const updateWebStatic = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id ) next( 'data missing' )

        const port = targetPort( req.body.id )
        const directory = targetDirectory( req.body.username )

        await execSync( `
            kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })

            cd ${ directory }
            git pull
            
            cd ${ directory }
            (serve -s dist -p ${ port }&)
            `, { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const updateNodeJs = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id || !req.body.runtimeVersion ) next( 'data missing' )

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

export const startWebStatic = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.id ) next( 'data missing' )

        const port = targetPort( req.body.id )
        const directory = targetDirectory( req.body.username )

        await execSync( `
            cd ${ directory }
            (serve -s dist -p ${ port }&)
            `, { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}


export const startNodeJs = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.id || !req.body.runtimeVersion ) next( 'data missing' )

        const port = targetPort( req.body.id )
        const directory = targetDirectory( req.body.username )

        await execSync( `
            source ${ process.env.NVM_DIR }/nvm.sh
            nvm use ${ req.body.runtimeVersion }

            cd ${ directory }
            (PORT=${ port } pnpm start&)
            `, { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}


export const stop = async ( req, res, next ) => {
    try {
        if ( !req.body.id ) next( 'data missing' )

        const port = targetPort( req.body.id )

        await execSync( `
            kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })
            `, { shell: '/bin/bash', stdio: 'inherit' } )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}

export const remove = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.id ) next( 'data missing' )

        const port = targetPort( req.body.id )
        const directory = targetDirectory( req.body.username )

        await execSync( `
            kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })
            rm -rf ${ directory } 
        `, { shell: '/bin/bash', stdio: 'inherit' } )

        if ( stderr ) next( stderr )

        res.status( 200 ).json( { message: stdout || "OK" } )
    } catch ( error ) {
        next( error )
    }
}