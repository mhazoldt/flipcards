let db = require("../db/db.js")
let uuid = require("uuid")
let bcrypt = require("bcrypt")


// endpoint: /api/register
// request: {"username": user1, "password": "password"}
//          {"status": "fail", "message": "could not register user"}
//
// registers new account and associated authentication token
function register(req, res, next) {
    console.log("-- register user --")
    let username = req.body.username
    console.log({username})
    let password = req.body.password
    let token = uuid()

    if(Object.keys(req.body).length === 0) {
        console.log("req.body length is 0")
        let jsonRes = {"status": "fail", "message": "could not register user"}
        console.log(jsonRes)
        console.log("")
        res.json(jsonRes)
    } else {
        bcrypt.hash(password, 10, bcryptResult)
        function bcryptResult(err, hashedPassword) {
            console.log("hashedPassword")
            console.log(hashedPassword)
            let sql = "INSERT INTO users (username, password, token) VALUES(?, ?, ?)"
            db.query(sql, [username, hashedPassword, token], usersResults)
        }
    }
    function usersResults(err, results, fields) {
        if(err) {
            console.log(err)
            let jsonRes = {"status": "fail", "message": "could not register user"}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        } else {
            console.log(err)
            console.log(results)
            console.log(fields)
            console.log("")
            res.json({"message": "user registered", "token": token})
        }
        
    }
}

// endpoint: /api/token
// request:  {"username": user1, "password": "password"}
// response: {"status": "success", "token": "token"}       
//           {"status": "fail", "message": "could not update token"}
//
// updates token
function token(req, res, next) {
    console.log("-- update token --")
    let username = req.body.username
    let password = req.body.password
    let token = null

    if(Object.keys(req.body).length === 0) {
        console.log("req.body length is 0")
        let jsonRes = {"status": "fail", "message": "could not update token"}
        console.log(jsonRes)
        console.log("")
        res.json(jsonRes)
    } else {
        let sql = "SELECT password FROM users WHERE username = ?"
        db.query(sql, [username], usersResults)
        function usersResults(err, results, fields) {
            let hashedPassword = results[0].password
            bcrypt.compare(password, hashedPassword, bcryptResults)
        }
    }   
    function bcryptResults(result) {
        if(result) {
            token = uuid()

            let tokenUpdateSql = "UPDATE users SET token = ? WHERE username = ?"
            db.query(tokenUpdateSql, [token, username], tokenUpdateResults)
        } else {
            console.log("no bcrypt result")
            let jsonRes = {"status": "fail", "message": "could not update token"}
            console.log(jsonRes)
            res.json(jsonRes) 
        }
    }
    function tokenUpdateResults() {
        console.log("* token updated *")
        let jsonRes = {"status": "success", "token": token}
        console.log(jsonRes)
        res.json(jsonRes)
    }
}



/// export functions
module.exports = {register, token}