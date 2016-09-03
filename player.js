
module.exports = {

  VERSION: "Default JavaScript folding player",

  bet_request: function(game_state, bet) {
      
      
    if(game_state)
        console.log(JSON.stringify(game_state));  
      
      
    bet(200);
  },
    
    

  showdown: function(game_state) {

  }
};
