import { Storage } from "@google-cloud/storage";
import path from "path";
import os from "os";

const storage = new Storage({
    keyFilename: process.env.CREDENTIAL_FILE
});

export const getFiles = async(options = {}) => {
    try {
        const bucketLists = await storage.bucket(process.env.BUCKET_NAME).getFiles({
            ...options
        });
        let files = (bucketLists[0] || []).map(file => {
            return {
                size: +(file.metadata?.size || 0),
                isDir: file.name.charAt(file.name.length - 1) === '/',
                name: path.basename(file.name),
                url:  file.publicUrl(),
                filetype: file.name.split(".").pop(),
            };
        });
        return [files, bucketLists[2]?.nextPageToken];
    } catch (error) {
        console.log(error);
        return [[], error];
    }
}