import { exec, execSync } from "node:child_process"
import util from "node:util"

const Run = util.promisify( exec )

export const create = async ( req, res, next ) => {
    try {
        if ( !req.body.dbname || !req.body.type || !req.body.username || !req.body.password ) throw new Error( 'data missing' )

        if ( req.body.type == 'mysql' ) {
            await execSync( `
                mysql -u root -p

                CREATE USER ${ req.body.username }@localhost IDENTIFIED BY '${ req.body.password }';
                GRANT ALL PRIVILEGES ON ${ req.body.dbname }.* TO ${ req.body.username }@localhost;

                CREATE DATABASE $DB_NAME;

            `, { shell: '/bin/bash', stdio: 'inherit' } )

            if ( stderr ) throw new Error( stderr )
        } else if ( req.body.type == 'postgresql' ) {
            console.log(req.body);
            await execSync( `
                sudo -u postgres psql

                CREATE USER ${ req.body.username } WITH PASSWORD '${ req.body.password }';
                CREATE DATABASE ${ req.body.dbname } WITH OWNER ${ req.body.username };

            `, { shell: '/bin/bash', stdio: 'inherit' } )

            if ( stderr ) throw new Error( stderr )
        } else throw new Error( "Invalid DB type" )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}

export const update = async ( req, res, next ) => {
    try {
        const { stdout, stderr } = await Run( `
        
            `, { shell: '/bin/bash' } )

        if ( stderr ) throw new Error( stderr )
        res.status( 200 ).json( { message: stdout } )
    } catch ( error ) {
        next( error )
    }
}

export const remove = async ( req, res, next ) => {
    try {
        const { stdout, stderr } = await Run( `
        
            `, { shell: '/bin/bash' } )

        if ( stderr ) throw new Error( stderr )
        res.status( 200 ).json( { message: stdout } )
    } catch ( error ) {
        next( error )
    }
}