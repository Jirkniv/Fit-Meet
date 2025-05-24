import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { CreateBucketCommand } from "@aws-sdk/client-s3";


const bucketName = process.env.S3_BUCKET || "bootcamp";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
});

export async function createBucket() {

await s3.send(new CreateBucketCommand
    ({ Bucket: bucketName,}));

    console.log(`Bucket ${bucketName} criado com sucesso`);
}
let uploadImagesCount = 0
export async function uploadImage(file: Express.Multer.File) {
    uploadImagesCount++
    const fileName = uploadImagesCount.toString() + file.originalname.toLowerCase()

    const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
            
    };
    await s3.send(new PutObjectCommand(uploadParams));
    return `${process.env.S3_ENDPOINT}/${bucketName}/${fileName}`
}