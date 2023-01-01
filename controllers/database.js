import { exec, execSync } from "node:child_process"
import util from "node:util"

const Run = util.promisify( exec )

export const create = async ( req, res, next ) => {
    try {
        if ( !req.body.dbname || !req.body.type || !req.body.username || !req.body.password ) throw new Error( 'data missing' )

        if ( req.body.type == 'mysql' ) {
            // const rootPassword = ''

            // mysql -u root -p ${rootPassword} -e "create database somedb"
            await execSync( `
                sudo mysql -e "CREATE USER '${ req.body.username }'@'%' IDENTIFIED BY '${ req.body.password }';";
                sudo mysql -e "GRANT ALL PRIVILEGES ON '${ req.body.dbname }'.* TO '${ req.body.username }'@'%';";

                sudo mysql -e "CREATE DATABASE '${ req.body.dbname }';";

            `, { shell: '/bin/bash', stdio: 'inherit' } )

        } else if ( req.body.type == 'postgresql' ) {
            // const postgresPassword = ''

            // sudo -u postgres -p ${postgresPassword} psql -c "create database somedb"
            await execSync( `
                sudo -u postgres psql -c "CREATE USER ${ req.body.username } WITH PASSWORD '${ req.body.password }';"
                sudo -u postgres psql -c "CREATE DATABASE ${ req.body.dbname } WITH OWNER ${ req.body.username };"

            `, { shell: '/bin/bash', stdio: 'inherit' } )

        } else next( "Invalid DB type" )

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