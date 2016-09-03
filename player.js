var _ = require('underscore');
var Hand = require('pokersolver').Hand;

var ourTeamId = 1;

var shortCardName = function(card){
  if (card.rank === '10') {
    return 'T' + card.suit.charAt(0);
  } else {
    return card.rank + card.suit.charAt(0);
  }
};

var extractHandFromGame = function(game_state){
  var hand = [],
      me = game_state.players.filter(function(player){
              if(player.id == ourTeamId) return player;
           }),
      publicCards = game_state.community_cards;
   _.forEach(me[0].hole_cards, function(card){
      hand.push(shortCardName(card));
   });
  _.forEach(publicCards, function(card){
    hand.push(shortCardName(card));
  });

  return hand;
};

module.exports = {

  VERSION: "Default JavaScript folding player",

  bet_request: function(game_state, bet) {

    var handToBetOn = extractHandFromGame(game_state),
        hand = Hand.solve(handToBetOn),
        handRank = hand.rank;

    if(game_state)
        console.log(JSON.stringify(game_state));

    bet(200);
  },

  hand: function(game_state){
    return extractHandFromGame(game_state);
  },

  showdown: function(game_state) {

  }
};
