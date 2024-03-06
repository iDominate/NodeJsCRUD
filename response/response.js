

/**
 * 
 * @param {Object} data data or error
 * @param {Number} statuscode the status code to return 
 * @param {Boolean} isError if the data is an error message
 * 
 * @returns {Object} the response object 
 */
const generateResponse = (data, statuscode = 200, isError = false) => {
    return {
        status: isError ? 'error' : 'ok',
        statuscode,
        data
    }
}

module.exports = generateResponse