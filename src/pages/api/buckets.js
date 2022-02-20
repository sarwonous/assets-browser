import { loadBuckets } from "../../libs/bucket";
export default async function handler(req, res) {
    try {
        const buckets = await loadBuckets();
        res.status(200).json(buckets);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    } 
}