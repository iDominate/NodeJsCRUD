const generateResponse = require("../response/response");


const validateJSON = (err, req, res, next) => {
    if (err.type == 'entity.parse.failed') {
        return res.json(generateResponse('invalid json', 400, true)).status(400)
    } else
        next();
};


module.exports = validateJSON