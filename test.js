var game_state = {
	"tournament_id": "57c96a3e33215a0003000002",
	"game_id": "57ca79e4cdd13b0003000049",
	"round": 1,
	"players": [{
		"name": "Comfortable Pugs",
		"stack": 1396,
		"status": "active",
		"bet": 4,
		"version": "Default JavaScript folding player",
		"id": 0
	}, {
		"name": "Hilarious Eagle",
		"stack": 598,
		"status": "active",
		"bet": 2,
		"hole_cards": [{
			"rank": "4",
			"suit": "clubs"
		}, {
			"rank": "5",
			"suit": "clubs"
		}],
		"version": "Default JavaScript folding player",
		"id": 1
	}, {
		"name": "Sexy Bacon",
		"stack": 0,
		"status": "out",
		"bet": 0,
		"version": "V3",
		"id": 2
	}],
	"small_blind": 2,
	"big_blind": 4,
	"orbits": 0,
	"dealer": 0,
	"community_cards": [
		{
			"rank": "9",
			"suit": "diamonds"
		},
		{
			"rank": "9",
			"suit": "diamonds"
		},
		{
			"rank": "10",
			"suit": "diamonds"
		}
	],
	"current_buy_in": 4,
	"pot": 6,
	"in_action": 1,
	"minimum_raise": 2,
	"bet_index": 3
};

var player = require('./player');

var hand = player.bet_request(game_state, function (bet) {

    console.log(bet);    
});
