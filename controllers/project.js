import { exec, execSync } from "node:child_process"
import util from "node:util"

const Run = util.promisify( exec )

const targetDirectory = ( username ) => `${ process.env.APPS_DIRECTORY }/${ username }/frontend`
const targetPort = ( id ) => 10000 + parseInt( id )

export const create = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id || !req.body.type ) throw new Error( 'data missing' )
        if ( req.body.type == 'NodeJs' && !req.body.runtimeVersion ) throw new Error( 'data missing' )

        const directory = targetDirectory( req.body.username )
        const port = targetPort( req.body.id )

        console.log( directory, port );
        return

        if ( req.body.type == 'NodeJs' ) {
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
            
        } else if ( req.body.type == 'WebStatic' ) {
            const { stderr } = await Run( `
                mkdir -p ${ directory } ;
                git clone --depth 1 --no-checkout ${ req.body.sourceCode } ${ directory } ;
                cd ${ directory } ;

                git sparse-checkout set dist ;
                git checkout` )
            if ( stderr ) throw new Error( stderr )

            await execSync( `
                cd ${ directory } ;
                (serve -s dist -p ${ port }&)
                ` , { shell: '/bin/bash', stdio: 'ignore' } )
            
        } else throw new Error( "Invalid Application type" )

        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const update = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.sourceCode || !req.body.id || !req.body.type ) throw new Error( 'data missing' )
        if ( req.body.type == 'NodeJs' && !req.body.runtimeVersion ) throw new Error( 'data missing' )

        const port = targetPort( req.body.id )
        await execSync( `kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })`, { shell: '/bin/bash', stdio: 'ignore' } )

        const directory = targetDirectory( req.body.username )

        if ( req.body.type == 'NodeJs' ) {
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
            
        } else if ( req.body.type == 'WebStatic' ) {
            const { stderr } = await Run( `
                cd ${ directory } ;
                git pull`)
            if ( stderr ) throw new Error( stderr )

            await execSync( `
                cd ${ directory } ;
                (serve -s dist -p ${ port }&)
                ` , { shell: '/bin/bash', stdio: 'ignore' } )
        }

        res.status( 200 ).json( { url: `${ process.env.HOST }:${ port }` } )
    } catch ( error ) {
        next( error )
    }
}

export const stop = async ( req, res, next ) => {
    try {
        if ( !req.body.id ) throw new Error( 'data missing' )

        const port = targetPort( req.body.id )
        const { stdout, stderr } = await Run( `kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })`, { shell: '/bin/bash' } )

        if ( stderr ) throw new Error( stderr )
        res.status( 200 ).json( { message: stdout } )
    } catch ( error ) {
        next( error )
    }
}

export const remove = async ( req, res, next ) => {
    try {
        if ( !req.body.username || !req.body.id ) throw new Error( 'data missing' )

        const port = targetPort( req.body.id )
        const directory = targetDirectory( req.body.username )
        const { stdout, stderr } = await Run( `
            kill -15 $(lsof -t -i :${ port }) && kill -9 $(lsof -t -i :${ port })
            rm -rf ${ directory } 
        `, { shell: '/bin/bash' } )

        if ( stderr ) throw new Error( stderr )

        res.status( 200 ).json( { message: stdout || "OK" } )
    } catch ( error ) {
        next( error )
    }
}