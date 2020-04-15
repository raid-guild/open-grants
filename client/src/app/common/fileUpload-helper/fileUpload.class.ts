// import { Injectable } from '@angular/core';
// var path = require('path');
// import { Storage } from '@google-cloud/storage';

// @Injectable({
//     providedIn: 'root'
// })
// export class ImageUploadService {

//     constructor() { }

//     async uploadImage(file: any) {
//         return new Promise(async (resolve, reject) => {
//             if (!file) {
//                 reject('No image file');
//             }

//             const storage = new Storage({
//                 projectId: "grants-platform",
//                 keyFilename: path.join(__dirname, '../../serviceAccount.json')
//             });

//             let bucketName = "grants-platform.appspot.com";

//             var filePath = path.join(__dirname, '..', '..', file.path);
//             console.log("jsonPath", typeof filePath, filePath);

//             let res = await storage.bucket(bucketName).upload(filePath, {
//                 // gzip: true,
//                 metadata: {
//                     // cacheControl: 'public, max-age=31536000',
//                     contentType: file.mimetype
//                 },
//             });

//             const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${file.filename}?alt=media`;

//             // console.log("url", res);
//             resolve(url);
//         });
//     }
// }