var express = require('express')
var router = express.Router()

let cardsController = require('../controllers/cardsController')


// create new deck
router.post('/api/decks', cardsController.add)

// create new card
router.post('/api/decks/:deck_id', cardsController.addCard)

// edit card
router.post('/api/decks/:deck_id/:card_id', cardsController.editCard)

// delete card
router.delete('/api/cards/:card_id', cardsController.deleteCard)

// record quiz tally
router.post('/api/cards/tally/:card_id', cardsController.quizTally)

module.exports = router