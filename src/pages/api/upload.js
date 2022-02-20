import to from "await-to-js";
import { newFile } from "../../libs/cloud";
import enabled from "../../libs/middleware/enabled";

export default async function handler(req, res) {
    await enabled('upload');
    const id = req.headers['x-file-id'];
    const name = req.headers['x-file-name'];
    const bucket = req.headers['x-bucket-name'];
    if (!id || !name || !bucket) {
        res.status(500).send({
            error: 'file request error'
        });
        return;
    }
    const [err, file] = await to(newFile(bucket, name));
    if (err) {
        res.status(500).send({
            error: 'file request error'
        });
        return;
    }
    const urlOptions = {
        action: 'write',
        expires: new Date((new Date()).getTime() + (10 * 60 * 1000)), 
        version: 'v4',
    };
    try {
        const url = await file.getSignedUrl(urlOptions);
        res.send({
            url,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error.message,
        });
    }
}