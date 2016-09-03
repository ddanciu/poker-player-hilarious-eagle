var http = require('http'),
    _ = require('underscore');

var ourTeamId = 1, me = undefined;;

var extractHandFromGame = function (game_state) {
    var hand = [],
        publicCards = game_state.community_cards;
    me = game_state.players.filter(function (player) {
        if (player.id == ourTeamId) return player;
    })[0];

    _.forEach(me.hole_cards, function (card) {
        hand.push(card);
    });
    _.forEach(publicCards, function (card) {
        hand.push(card);
    });

    return hand;
};

var playGame = function (game_state, bet) {
    var myHand = extractHandFromGame(game_state);
    var t0 = new Date().getTime();
    if(myHand.length >= 5) {
        var request = http.get("http://rainman.leanpoker.org/rank?cards=" + JSON.stringify(myHand), function (response) {
            var body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                console.log(new Date().getTime() - t0);
                var data = JSON.parse(body);
                placeBet(data.rank, data.value, data.second_value, game_state, bet);
            });
        });
        request.on('error', function (err) {
            console.log("an error occured ");
            bet(0);
        });
    } else {
        if( myHand[0].rank === myHand[1].rank || handIs(myHand, 'A', 'K')){
            raise(4, myHand[0].rank, myHand[1].rank, game_state, bet);
        } if (handHas(myHand, 'A')){
            raise(2, myHand[0].rank, myHand[1].rank, game_state, bet);
        } else {
            placeBet(1, myHand[0].rank, myHand[1].rank, game_state, bet);
        }

    }
};

var handHas = function(hand, rank){
  return hand[0].rank == rank || hand[1].rank == rank;
};

var handIs = function (hand, rank1, rank2){
    if(hand[0].rank == rank1 && hand[1].rank == rank2){
        return true;
    } else if(hand[0].rank == rank2 && hand[1].rank == rank1){
        return true;
    } else {
        return false;
    }
};


var placeBet = function (handRank, firstValue, secondValue, game_state, bet) {
    if (handRank == 0 ) {
        bet(0);
    } else if (handRank >= 1 && handRank <= 4) {
        call(handRank, firstValue, secondValue, game_state, bet);
    } else {
        raise(handRank, firstValue, secondValue, game_state, bet);
    }
};

var call = function (handRank, firstValue, secondValue, game_state, bet) {
    console.log("decision to call for hand " + handRank + " with first value " + firstValue + " and second " + secondValue);
    var amountToCall = game_state.current_buy_in - game_state.players[game_state.in_action].bet;

    if(handRank == 1 && firstValue < 8 && game_state.community_cards.length > 3) {
        bet(0);
    } else if(amountToCall > 500 && handRank < 6){
        bet(0);
    } else {
        bet(amountToCall);
    }
};

var raise = function raise(handRank, firstValue, secondValue, game_state, bet) {
    console.log("decision to raise ");
    var amountToCall = game_state.current_buy_in - game_state.players[game_state.in_action].bet,
        minRaise = game_state.minimum_raise,
        amountToRaise = Math.floor( (me.stack - amountToCall - minRaise) * ((handRank + 2) / 10));

    if(amountToCall > 500 && handRank < 6){
        bet(0);
    } else {
        bet(amountToCall + minRaise + amountToRaise);
    }

};


module.exports = {
    VERSION: "BE-AGRESSIVE",

    bet_request: function (game_state, bet) {
        playGame(game_state, bet);
    },

    showdown: function (game_state) {

    }
};

