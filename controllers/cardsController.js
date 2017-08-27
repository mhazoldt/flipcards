let db = require('../db/db.js')

// endpoint: POST /api/decks
// request body: {"name": "pokemon"}
// request header: {"Authorization": token}
//
// response: {"status": "success", "message": "added pokemon as deck"}
//           {"status": "fail", "message": "could not add deck"}
//
// add new deck
function add(req, res, next) {
    console.log("-- add deck --")
    let name = req.body.name
    let token = req.get("Authorization")
    let user_id = null

    if(Object.keys(req.body).length === 0) {
        console.log("req.body has key length of 0")
        res.json({"status": "fail", "message": "could not add deck"})
    } else {

        // get username from token
        db.query("SELECT * FROM users WHERE token = ?", [token], tokenResults)

    }
    function tokenResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add deck"})
        } else {
            user_id = results[0].user_id

            console.log("adding deck to database")

            db.query("INSERT INTO decks (name, user_id) VALUES (?, ?)", [name, user_id], deckResults)
        }
    }
    function deckResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add deck"})
        } else {
            let message = `added ${name} as deck`
            let jsonRes = {"status": "success", "message": message}
            console.log("* deck added *")
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}


// endpoint: POST /api/decks/:deck_id
// request body: {"question": "question", "answer": "answer"}
// request header: {"Authorization": token}
//
// response: {"status": "success", "name": "laps", "completed": 5, "completed_date": "YYYY-MM-DD"}
//           {"status": "fail", "message": "could not add card"}
//
// add card to deck
function addCard(req, res, next) {
    console.log("-- add card --")
    let deck_id = req.params["deck_id"]
    let question = req.body.question
    let answer = req.body.answer
    let name = null
    let user_id = null
    let token = req.get("Authorization")

    if(Object.keys(req.body).length === 0) {
        console.log("req.body key length is 0")
        res.json({"status": "fail", "message": "could not add data"})
    } else {

        // get username from token
        db.query("SELECT * FROM users WHERE token = ?", [token], tokenResults)

    }
    function tokenResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add card"})
        } else {
            user_id = results[0].user_id

            console.log("adding card to deck")

            // make sure deck exists
            db.query("SELECT * FROM decks WHERE deck_id = ? AND user_id = ?", [deck_id, user_id], deckResults)
        }
    }
    function deckResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add deck"})
        } else if(results.length === 0) {
            console.log("results length is 0")
            res.json({"status": "fail", "message": "could not add deck"})

        } else {
            name = results[0].name
            user_id = results[0].user_id

            // insert card
            console.log("creating new card")
            db.query("INSERT INTO cards (card_id, question, answer, deck_id, user_id) VALUES(?, ?, ?, ?, ?)", [deck_id, question, answer, deck_id, user_id], cardResults)
            
        }
    }
    function cardResults(err, results, fields) {
        if(err) {
            console.log(err)
            console.log("could not add card")
            res.json({"status": "fail", "message": "could not add card"})
        } else {
            
            console.log("* card added *")
            let jsonRes = {"status": "success", "name": name, "question": question, "answer": answer}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}


// endpoint: POST /api/decks/:deck_id/:card_id
// request body: {"question": "question", "answer": "answer"}
// request header: {"Authorization": token}
//
// response: {"status": "success", "name": "laps", "completed": 5, "completed_date": "YYYY-MM-DD"}
//           {"status": "fail", "message": "could not add card"}
//
// edit card in deck
function editCard(req, res, next) {
    console.log("-- edit card --")
    let deck_id = req.params["deck_id"]
    let card_id = req.params["card_id"]
    let question = req.body.question
    let answer = req.body.answer
    let name = null
    let user_id = null
    let token = req.get("Authorization")

    if(Object.keys(req.body).length === 0) {
        console.log("req.body key length is 0")
        res.json({"status": "fail", "message": "could not add data"})
    } else {

        // get username from token
        db.query("SELECT * FROM users WHERE token = ?", [token], tokenResults)

    }
    function tokenResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not edit card"})
        } else {
            user_id = results[0].user_id


            // make sure deck exists
            db.query("SELECT * FROM decks WHERE deck_id = ? AND user_id = ?", [deck_id, user_id], deckResults)
        }
    }
    function deckResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not edit card"})
        } else if(results.length === 0) {
            console.log("results length is 0")
            res.json({"status": "fail", "message": "could not edit card"})

        } else {
            name = results[0].name
            user_id = results[0].user_id

            // update card
            console.log("updating card")
            db.query("UPDATE cards SET question = ?, answer = ? WHERE card_id = ?", [question, answer, card_id], cardResults)
            
        }
    }
    function cardResults(err, results, fields) {
        if(err) {
            console.log(err)
            console.log("could not edit card")
            res.json({"status": "fail", "message": "could not edit card"})
        } else {
            
            console.log("* card edited *")
            let jsonRes = {"status": "success", "name": name, "question": question, "answer": answer}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}



// endpoint: DELETE /api/cards/:card_id
// request: {}
// response: {"status": "success", "message": "card removed"}
//           {"status": "fail", "message": "card could not be removed"}
//
// delete activity data for a day
function deleteCard(req, res, next) {
    console.log("-- delete card --")
    let card_id = req.params["card_id"]
    let token = req.get("Authorization")


    // get username from token
    db.query("SELECT * FROM users WHERE token = ?", [token], tokenResults)

    function tokenResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not edit card"})
        } else {
            user_id = results[0].user_id

            db.query("DELETE FROM cards WHERE card_id = ? AND user_id = ?", [card_id, user_id], deleteResults) 
            
        }
    }
    function deleteResults(err, results, fields) {
        if(err){
            console.log(err)
            res.json({"status": "fail", "message": "card could not be removed"})
        } else {
            console.log("* card deleted *")
            jsonRes = {"status": "success", "message": "card removed"}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }
}

// endpoint: DELETE /api/cards/tally/:card_id
// request: {"correct": 1}
//  expects bool value 0 or 1
// response: {"status": "success", "message": "tally recorded"}
//           {"status": "fail", "message": "tally could not be recorded"}
//
// add card tally
function quizTally(req, res, next) {
    console.log("-- add tally --")
    let card_id = req.params["card_id"]
    let user_id = null
    let correct = req.body.correct
    let token = req.get("Authorization")

    if(Object.keys(req.body).length === 0) {
        console.log("req.body key length is 0")
        res.json({"status": "fail", "message": "could not add tally"})
    } else {

        // get username from token
        db.query("SELECT * FROM users WHERE token = ?", [token], tokenResults)

    }
    function tokenResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add card"})
        } else {
            user_id = results[0].user_id

            console.log("adding card to deck")

            // make sure card exists
            db.query("SELECT * FROM cards WHERE card_id = ? AND user_id = ?", [card_id, user_id], cardResults)
        }
    }
    function cardResults(err, results, fields) {
        if(err) {
            console.log(err)
            res.json({"status": "fail", "message": "could not add deck"})
        } else if(results.length === 0) {
            console.log("results length is 0")
            res.json({"status": "fail", "message": "could not add deck"})

        } else {

            // insert tally
            console.log("creating new tally")
            db.query("INSERT INTO tally (card_id, user_id, correct) VALUES(?, ?, ?)", [card_id, user_id, correct], tallyResults)
            
        }
    }
    function tallyResults(err, results, fields) {
        if(err) {
            console.log(err)
            console.log("could not add tally")
            res.json({"status": "fail", "message": "could not add tally"})
        } else {
            
            console.log("* tally added *")
            let jsonRes = {"status": "success", "correct": correct}
            console.log(jsonRes)
            console.log("")
            res.json(jsonRes)
        }
    }

}

module.exports = {add, addCard, editCard, deleteCard, quizTally}