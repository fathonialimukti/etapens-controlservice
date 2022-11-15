import util from "node:util"
import { exec } from "node:child_process"
import pids from 'port-pid'


const Run = util.promisify( exec )
const commandDir = "../command"

export const create = async ( req, res, next ) => {
    try {
        const { stdout, stderr } = await Run( `sh ${ commandDir }/create.sh --username ${ req.body.username } --source-code ${ req.body.sourceCode } ${ req.body.type == "frontend" ? "-f" : "-b" } --port ${ req.body.port }` )

        res.status( 200 ).json( { message: stdout, error: stderr } )
    } catch ( error ) {
        next( error )
    }
}

export const update = async ( req, res, next ) => {
    try {
        const processPid = await pids( req.body.port )
        const pid = processPid.all.pop()
        await Run( `sh ${ commandDir }/stop.sh -pid ${ pid }` )

        await Run( `sh ${ commandDir }/update.sh --username ${ req.body.username } ${ req.body.appType == "frontend" ? "-f" : "-b" }` )

        res.status( 200 ).json( { message: "OK" } )
    } catch ( error ) {
        next( error )
    }
}

export const remove = async ( req, res, next ) => {
    try {
        const processPid = await pids( req.body.port )
        const pid = processPid.all.pop()
        await Run( `sh ${ commandDir }/stop.sh -pid ${ pid }` )

        const { stdout, stderr } = await Run( `sh ${ commandDir }/delete.sh --username ${ req.body.username } ${ req.body.appType == 'frontend' ? '-f' : '-b' }` )

        res.status( 200 ).json( { message: stdout, error: stderr } )
    } catch ( error ) {
        next( error )
    }
}