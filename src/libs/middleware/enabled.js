export default function(mode) {
    return function(req, res, next) {
        if (mode === 'delete') {
            if (+process.env.ALLOW_DELETE !== 1) {
                res.status(404).send({
                    error: 'Method not Allowed'
                });
                return;
            }
            next();
        } else if (mode === 'upload') {
            if (+process.env.ALLOW_UPLOAD !== 1) {
                res.status(404).send({
                    error: 'Method not Allowed'
                });
                return;
            }
            next();
        } else {
            next();
        }
    }
}