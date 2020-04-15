import { async } from "rxjs/internal/scheduler/async";
import { format } from "path";
var path = require('path');
import { Injectable } from "@nestjs/common";
const { Storage } = require('@google-cloud/storage');

@Injectable()
export class ImageUploadService {
    bucket: any;

    constructor() { }

    async uploadImage(file: any) {
        return new Promise(async (resolve, reject) => {
            if (!file) {
                reject('No image file');
            }

            const storage = new Storage({
                projectId: "grants-platform",
                keyFilename: path.join(__dirname, '../../serviceAccount.json')
            });

            let bucketName = "grants-platform.appspot.com";

            var filePath = path.join(__dirname, '..', '..', file.path);
            // console.log("jsonPath", typeof filePath, filePath);

            let res = await storage.bucket(bucketName).upload(filePath, {
                // gzip: true,
                metadata: {
                    // cacheControl: 'public, max-age=31536000',
                    contentType: file.mimetype
                },
            });

            const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${file.filename}?alt=media`;

            // console.log("url", res);
            resolve(url);

            // console.log(`${file.path} uploaded to ${bucketName}.`);
            // console.log("storage", storage)

            // this.bucket = storage.bucket("grants-platform.appspot.com");
            // let newFileName = `${file.originalname}_${Date.now()}`;
            // let fileUpload = this.bucket.file(filePath);

            // const blobStream = fileUpload.createWriteStream({
            //     metadata: {
            //         contentType: file.mimetype
            //     }
            // });

            // blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            //     const url = `https://storage.googleapis.com/${this.bucket.name}/${fileUpload.name}`;
            //     resolve(url);
            // });

            // blobStream.on('error', (error) => {
            //     console.log("error", error);
            //     reject('Something is wrong! Unable to upload at the moment.');
            // });

            // blobStream.end(file.buffer);
        });
    }
}