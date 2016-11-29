function attachEvents() {
    const appId = 'kid_S1deP_DMe';
    const appUrl = 'https://baas.kinvey.com/appdata/' + appId + '/';
    const user = 'guest';
    const pass = 'guest';
    const authHeaders = {
        Authorization: 'Basic ' + btoa(user + ':' + pass),
    };

    const money_const = 600;
    const bullets_const = 6;

    $('#addPlayer').click(addPlayer);

    function loadPlayers() {
        $.get({
            url: appUrl + 'players',
            headers: authHeaders,
        })
            .then(displayPlayers)
            .catch(displayError);
    }

    loadPlayers();

    function addPlayer() {
        let playerName = $('#addName').val();
        let player = {
            name: playerName,
            money: money_const,
            bullets: bullets_const
        };
        $('#addName').val('');
        if(playerName !== ''){
            $.post({
                url: appUrl + 'players/',
                headers: authHeaders,
                data: JSON.stringify(player),
                contentType: 'application/json'
            })
                .then(loadPlayers)
                .catch(displayError);
        }
    }

    function displayPlayers(players) {
        $('#players').empty();
        for(let player of players) {
            let playerDiv = $('<div>')
                .addClass('player')
                .attr('data-id', player._id)
                .append($('<div>')
                    .addClass('row')
                    .append($('<label>').text('Name: '))
                    .append($('<label>')
                        .addClass('name')
                        .text(player.name)))
                .append($('<div>')
                    .append($('<div>')
                        .addClass('row')
                        .append($('<label>').text('Money: '))
                        .append($('<label>')
                            .addClass('money')
                            .text(player.money))))
                .append($('<div>')
                    .append($('<div>')
                        .addClass('row')
                        .append($('<label>').text('Bullets: '))
                        .append($('<label>')
                            .addClass('bullets')
                            .text(player.bullets))))
                .append($('<div>')
                    .append($('<button>')
                        .addClass('play')
                        .text('Play'))
                    .click(() => playGame(player)))
                .append($('<div>')
                    .append($('<button>')
                        .addClass('delete')
                        .text('Delete'))
                    .click(() => deletePlayer(player._id)));
            $('#players').append(playerDiv);
        }
    }

    function playGame(player) {
        $('#canvas').show();
        $('#buttons').children().show();
        loadCanvas(player);
        $('#reload').click(() => reload(player));
        $('#save').click(() => save(player));
        $('#players .play').attr('disabled', 'disabled');
        $(`#players .player[data-id="${player._id}"] .delete`).attr('disabled', 'disabled');
    }

    function save(player) {
        $.ajax({
            method: "PUT",
            url: appUrl + `players/${player._id}`,
            headers: authHeaders,
            data: JSON.stringify(player),
            contentType: 'application/json'
        })
            .then(loadPlayers)
            .catch(displayError);

        clearInterval($('#canvas')[0].intervalId);
        $('#buttons').children().unbind().hide();
        $('#players .play').removeAttr('disabled');
        $(`#players .player[data-id="${player._id}"] .delete`)
            .removeAttr('disabled');
        $('#canvas').hide();
    }

    function reload(player) {
        player.money -= 60;
        player.bullets = 6;
    }

    function deletePlayer(id) {
        $.ajax({
            method: 'DELETE',
            url: appUrl + 'players/' + id,
            headers: authHeaders,
        })
            .then(loadPlayers)
            .catch(displayError);
    }

    function displayError(error) {
        console.dir(error);
    }
}