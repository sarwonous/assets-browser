import { Storage } from "@google-cloud/storage";
import fs from 'fs';
const storage = new Storage({
    keyFilename: "config/cloud-340705-f10697072688.json"
});

const STORAGE_URL = 'https://storage.googleapis.com/';
const BUCKET = 'suga-buckets';

export default async function handler(req, res) {
    const path = (req.query.path || []).join("/");
    // get list of buckets
    try {
        let files = await storage.bucket(BUCKET).getFiles({
            prefix: "/",
            delimiter: '/',
        });
        files = files[0].map(file => ({
            size: +(file.metadata?.size || 0),
            name: file.publicUrl(),
        })),
        res.send(files);
    } catch (error) {
        console.log(error);
        res.send("ok")
    } 
}