let db = require('../db/db.js')

function authenticate(req, res, next) {
    let token = req.get("Authorization")


    if(!token) {
        res.json({"status": "fail", "message": "invalid token"})
    } else {
        // token = token.substr(6)

        let sql = "SELECT * FROM users WHERE token = ?"
        db.query(sql, [token], tokenResults)
    }
    function tokenResults(err, results, fields) {
        if(results.length > 0) {
            next()
        } else {
            res.json({"status": "fail", "message": "invalid token"})
        }
    }
}

module.exports = authenticate