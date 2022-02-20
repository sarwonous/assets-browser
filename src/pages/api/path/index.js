import { getFiles } from "../../../libs/cloud";

export default async function handler(req, res) {
    const limit = req.query.limit > 0 ? req.query.limit : false;
    const token = req.query.next || "";
    // get list of buckets
    try {
        const options = {
            // prefix: `${path}/`,
            delimiter: '/',
        };
        if (limit) {
            options.maxResults = limit;
            options.autoPaginate = false;
            if (token) {
                options.pageToken = token;
            }
        }
        let [files, nextToken] = await getFiles(options);
        res.send({
            files: files,
            nextToken,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    } 
}