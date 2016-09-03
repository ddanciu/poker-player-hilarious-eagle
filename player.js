var http = require('http'),
    _ = require('underscore');

var ourTeamId = 1, me = undefined,
    intRank = {"2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8":8, "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A":14};

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
                if(intersect(game_state.community_cards, [data.value, data.second_value]) >= 1 &&
                    intersect(me.hole_cards, [data.value, data.second_value]) == 0) {
                    bet(0);
                } else {
                    placeBet(data.rank, data.value, data.second_value, game_state, bet);
                }

            });
        });
        request.on('error', function (err) {
            console.log("an error occured ");
            bet(0);
        });
    } else {
        var firstValue = _.max([intRank[myHand[0].rank], intRank[myHand[1].rank]]),
            secondValue = _.min([intRank[myHand[0].rank], intRank[myHand[1].rank]]);
        if( firstValue === secondValue || handIs(myHand, 'A', 'K')){
            raise(4, firstValue, secondValue, game_state, bet);
        } else {
            call(1, firstValue, secondValue, game_state, bet, true);
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

var call = function (handRank, firstValue, secondValue, game_state, bet, isFirstHand) {
    console.log("decision to call for hand " + handRank + " with first value " + firstValue + " and second " + secondValue);
    var amountToCall = game_state.current_buy_in - game_state.players[game_state.in_action].bet;
    console.log("Amount to call: " + amountToCall + " when my stack is " +  me.stack + " then the acceptable amount to call is " + (me.stack*0.2));
    if(handRank == 1 && firstValue < 8 && game_state.community_cards.length >= 3) {
        bet(0);
    } else if(amountToCall > (me.stack*0.2) && isFirstHand ){
        bet(0);
    } else if(amountToCall > (me.stack*0.4) && handRank < 4 ){
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

    if(amountToCall > 500 && handRank < 6) {
        bet(0);
    } else {
        bet(amountToCall + minRaise + amountToRaise);
    }

};

var intersect = function (base_cards, used) {
    var base = [];
    _.forEach(base_cards, function (card) {
        base.push(intRank[card.rank]);
    });
    //console.log("Base:" + base);
    //console.log("Used:" + used);
    //console.log(base[0] === used[0]);
    var inter = _.intersection(_.uniq(base), _.uniq(used));
    //console.log("intersection:" + inter);
    return inter.length;
};


module.exports = {
    VERSION: "JUST-IN-FOR-THE-GAME",

    bet_request: function (game_state, bet) {
        playGame(game_state, bet);
    },

    showdown: function (game_state) {

    }
};

