import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { getFileType } from "./file";

let storageOptions = {};
if (fs.existsSync(process.env.CREDENTIAL_FILE)) {
    storageOptions = {
        keyFilename: process.env.CREDENTIAL_FILE,
    };
} else {
    const authJson = {
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
    };
    
    storageOptions = {
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials: authJson,
    };
}
const storage = new Storage(storageOptions);

export const getFiles = async(bucket, options = {}) => {
    
    if (!bucket) {
        throw new Error('No Bucket Name');
    }
    try {
        const bucketLists = await storage.bucket(bucket).getFiles(options);
        let files = (bucketLists[0] || []).map(file => {
            return {
                size: +(file.metadata?.size || 0),
                isDir: file.name.charAt(file.name.length - 1) === '/',
                name: path.basename(file.name),
                url:  file.publicUrl(),
                ext: file.name.split(".").pop(),
                filetype: getFileType(file.name.split(".").pop()),
            };
        });
        return [files, bucketLists[2]?.nextPageToken];
    } catch (error) {
        throw error;
    }
}

export const newFile = async(bucket, name) => {
    try {
        const maxAgeSeconds = 3600;
        const responseHeader = '*';
        const method = "PUT";
        const origin = 'https://assets.local';
        await storage.bucket(bucket).setCorsConfiguration([
            {
              maxAgeSeconds,
              method: [method],
              origin: [origin],
              responseHeader: [responseHeader],
            },
          ]);
          console.log(`Bucket ${bucket} was updated with a CORS config
          to allow ${method} requests from ${origin} sharing 
          ${responseHeader} responses across origins`);
        const b = await storage.bucket(bucket).file(name);
        return b;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


export const loadBuckets = async() => {
    try {
        const res = await fsp.readFile(process.env.BUCKET_CONFIG_FILE, 'utf8');
        const config = JSON.parse(res);
        return config.buckets || [];
    } catch (error) {
        throw error;
    }
}