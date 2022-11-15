import { S3Client, CreateBucketCommand, PutBucketWebsiteCommand, GetBucketWebsiteCommand, CopyObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3"

const client = new S3Client( { region: "ap-southeast-1" } )

export const index = async ( req, res, next ) => {
    try {

        const bucketName = req.body.username
        const mainBucket = "etapens-storage140101-dev"
        await client.send(
            new CreateBucketCommand( {
                Bucket: bucketName
            } )
        )
        await client.send(
            new PutBucketWebsiteCommand( {
                Bucket: bucketName,
                WebsiteConfiguration: {
                    IndexDocument: {
                        Suffix: "index.html",
                    },
                }
            } )
        )

        const listObject = await client.send(
            new ListObjectsCommand( {
                Bucket: mainBucket,
                Prefix: `public/${ bucketName }/app/`
            } )
        )

        // data is inside result.Contents

        for ( const file of listObject.Contents ) {
            let newFileName = file.Key.split( '/' )

            newFileName.splice( 0, 3 )
            newFileName = newFileName.join( '/' )

            await client.send(
                new CopyObjectCommand( {
                    ACL: 'public-read',
                    CopySource: `/${mainBucket}/${ file.Key }`, // "/SOURCE_BUCKET_NAME/OBJECT_NAME"
                    Bucket: bucketName, // DESTINATION_BUCKET_NAME
                    Key: newFileName // OBJECT_NAME
                } )
            )
        }

        res.status( 200 ).json( {
            url: `http://${bucketName}.s3-website-ap-southeast-1.amazonaws.com`} )
    } catch ( error ) {
        next( error )
    }
}

