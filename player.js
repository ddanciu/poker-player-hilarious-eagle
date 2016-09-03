
module.exports = {

  VERSION: "Default JavaScript folding player",

  bet_request: function(game_state, bet) {
      
      
    if(game_state)
        console.out(game_state.players);  
      
      
    bet(200);
  },

  showdown: function(game_state) {

  }
};
