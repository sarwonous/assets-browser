import { getFiles, loadBuckets} from "../../../libs/cloud";

export default async function handler(req, res) {
    const bucket = req.query.path[0] || "";
    const path = (req.query.path || []).slice(1).join("/");
    const limit = req.query.limit > 0 ? req.query.limit : false;
    const token = req.query.next || "";
    // get list of buckets
    try {
        const buckets = await loadBuckets();
        const bucketConfig = buckets.find(b => b.name === bucket);
        if (!bucketConfig) {
            res.status(500).json({
                error: "No such bucket",
            }).end();
        }
        const options = {
            delimiter: '/',
        };
        if (bucketConfig.root != "" && bucketConfig.root != "/") {
            options.prefix = bucketConfig.root;
        }
        if (limit) {
            options.maxResults = limit;
            options.autoPaginate = false;
            if (token) {
                options.pageToken = token;
            }
        }
        let [files, nextToken] = await getFiles(bucket, options);
        res.send({
            bucket,
            files: files,
            nextToken,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    } 
}