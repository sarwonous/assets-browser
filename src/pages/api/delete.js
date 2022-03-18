import to from "await-to-js";
import { newFile } from "../../libs/cloud";
import enabled from "../../libs/middleware/enabled";

export default async function handler(req, res) {
    await enabled('delete');
    const name = req.headers['x-file-name'];
    const bucket = req.headers['x-bucket-name'];
    if (!name || !bucket) {
        res.status(500).send({
            error: 'file request error'
        });
        return;
    }
    const [err, file] = await to(newFile(bucket, name));
    if (err) {
        res.status(500).send({
            error: 'file request error',
        });
        return;
    }
    try {
        const exists = await file.exists();
        if (exists) {
            await file.makePublic();
        }
        const deleted = await file.delete({
            ignoreNotFound: true,
        });
        res.send({
            deleted,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error.message,
        });
    }
}