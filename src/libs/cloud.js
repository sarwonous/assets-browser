import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { getFileType } from "./file";

let config = false;

export const readConfig = () => {
    try {
        const fconfig = fs.readFileSync(process.env.BUCKET_CONFIG_FILE);
        const parsed = JSON.parse(fconfig);
        return {
            cors: {
                method: ["PUT"],
                origin: ["*"]
            },
            ...parsed
        }
    } catch (error) {
        return {};
    }
}

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
        const bucketConfig = getConfig().buckets.find(b => b.name === bucket);
        let files = (bucketLists[0] || []).map(file => {
            let publicUrl = file.publicUrl();
            for(var search in bucketConfig.replaceURL) {
                publicUrl = publicUrl.replace(search, bucketConfig.replaceURL[search]);
            }
            return {
                size: +(file.metadata?.size || 0),
                isDir: file.name.charAt(file.name.length - 1) === '/',
                name: path.basename(file.name),
                url:  publicUrl,
                ext: file.name.split(".").pop(),
                filetype: getFileType(file.name.split(".").pop()),
                metadata: file.metadata
            };
        });
        return [files, bucketLists[2]?.nextPageToken];
    } catch (error) {
        throw error;
    }
}

export const newFile = async(bucket, name) => {
    try {
        const b = await storage.bucket(bucket).file(name);
        return b;
    } catch (err) {
        throw err;
    }
}

export const loadBuckets = async() => {
    try {

        return getConfig().buckets || [];
    } catch (error) {
        throw error;
    }
}

export const getConfig = () => {
    if (!config.app_url) {
        config = readConfig();
    }
    return config;
}