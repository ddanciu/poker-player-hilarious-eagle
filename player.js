
module.exports = {

  VERSION: "Default JavaScript folding player",

  bet_request: function(game_state, bet) {
      
      
    if(game_state)
        console.log(JSON.stringify(game_state));  
      
      for (var player in game_state.players)
      
      
    bet(200);
  },
    
  hand : function(game_state) {
      return undefined;
  },    

  showdown: function(game_state) {

  }
};
