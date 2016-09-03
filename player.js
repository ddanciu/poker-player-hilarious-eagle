var _ = require('underscore'),
    whatIs = require('poker-has');


var extractHandFromGame = function(game_state){
  return [{rank:'2', type:'D'},
    {rank:'3', type:'D'}];
};

module.exports = {

  VERSION: "Default JavaScript folding player",

  bet_request: function(game_state, bet) {

    var handToBetOn = extractHandFromGame(game_state),
        hand = whatIs(handToBetOn),
        handRank = hand.strength;

    console.log("handRank: " + handRank);

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
