import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";

let options = {};

if (fs.existsSync(process.env.CREDENTIAL_FILE)) {
    options = {
        keyFilename: process.env.CREDENTIAL_FILE,
    };
} else {
    options = {
        credentials: {
            "type": process.env.GOOGLE_TYPE,
            "project_id": process.env.GOOGLE_PROJECT_ID,
            "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
            "private_key": process.env.GOOGLE_PRIVATE_KEY,
            "client_email": process.env.GOOGLE_CLIENT_EMAIL,
            "client_id": process.env.GOOGLE_CLIENT_ID,
            "auth_uri": process.env.GOOGLE_AUTH_URI,
            "token_uri": process.env.GOOGLE_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
            "client_x509_cert_url": process.env.GOOGLE_CLIENT_X509_CERT_URL
        }
    };
}

const storage = new Storage(options);

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