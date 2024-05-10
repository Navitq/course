let  aws  = require("aws-sdk");
let  dotenv  = require("dotenv");
let { randomBytes } = require("crypto");

dotenv.config(".env")

let region = "eu-north-1";
let bucketName = "navitq-course-it";
let accessKeyId = process.env.AWS_ACCESS_KEY_ID;
let secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
});

async function generateUrl(){
    let rawBytes = await randomBytes(16)
    let imageName = rawBytes.toString("hex")
    
    let params =({
        Bucket: bucketName,
        Key: imageName,
        Expires: 600
    }) 

    let uploadUrl = await s3.getSignedUrlPromise("putObject", params)
    return uploadUrl;
}

module.exports = {
    generateUrl
}; 
