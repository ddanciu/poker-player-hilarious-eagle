var _ = require('underscore'),
    Hand = require('pokersolver').Hand;


var extractHandFromGame = function(game_state){
  return ['As', 'Ac'];
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
    
  hand : function(game_state) {
      return undefined;
  },    

  showdown: function(game_state) {

  }
};
