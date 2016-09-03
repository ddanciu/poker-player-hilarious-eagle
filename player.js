var http = require('http'),
    _ = require('underscore');

var ourTeamId = 1;

var extractHandFromGame = function (game_state) {
    var hand = [],
        me = game_state.players.filter(function (player) {
            if (player.id == ourTeamId) return player;
        }),
        publicCards = game_state.community_cards;
    _.forEach(me[0].hole_cards, function (card) {
        hand.push(card);
    });
    _.forEach(publicCards, function (card) {
        hand.push(card);
    });

    return hand;
};

var playGame = function (game_state, bet) {
    var myHand = extractHandFromGame(game_state);
    var request = http.get("http://rainman.leanpoker.org/rank?cards=" + JSON.stringify(myHand), function (response) {
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            var data = JSON.parse(body);
            console.log(body);
            placeBet(data.rank, game_state, bet);
        });
    });
    request.on('error', function (err) {
        console.log("an error occured ");
        bet(0);
    });


};

var placeBet = function (handRank, game_state, bet) {
    if (handRank == 0 || handRank == 1) {
        bet(0);
    } else if (handRank >= 2 && handRank <= 5) {
        call(game_state, bet);
    } else {
        raise(game_state, bet);
    }
};

var call = function (game_state, bet) {
    return bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet);
};

var raise = function raise(game_state, bet) {
    return bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet + game_state.minimum_raise + 200);
};



module.exports = {
    VERSION: "V1",

    bet_request: function (game_state, bet) {
        if (game_state)
            console.log(JSON.stringify(game_state));

        playGame(game_state, bet);
    },

    showdown: function (game_state) {

    }
};

