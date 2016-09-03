module.exports = {

    VERSION: "Default JavaScript folding player",

    bet_request: function (game_state, bet) {
        var handRank = 8;
        if (game_state)
            console.log(JSON.stringify(game_state));

       // placeBet(handRank, game_state, bet);
       bet(200);
    },

    showdown: function (game_state) {

    }
};

function placeBet(handRank, game_state, bet) {
    if (handRank == 0 || handRank == 1) {
        bet(0);
    } else if (handRank >= 2 && handRank <= 5) {
        call(game_state, bet);
    } else {
        raise(game_state, bet);
    }
}

function call(game_state, bet) {
    return bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet);
}

function raise(game_state, bet) {
    return bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet + game_state.minimum_raise + 1);
}
