class Team {
    constructor(name) {
        this.name = name;
        this.players = [];
    }

    addPlayer(name, position){
        this.players.push(new Player(name, position));
    }
}

class Player {
    constructor(name, position) {
        this.name = name;
        this.position = position;
    }
}

class TeamService {
    static url = 'https://6354abb8e64783fa8287bf3c.mockapi.io/api/teams';

    static getAllTeams(){
        return $.get(this.url);
    }
    static getTeam(id) {
        return $.get(this.url + `/${id}`);
    }

    static createTeam(team){
        return $.post(this.url, team);
    }

    static updateTeam(team) {
        return $.ajax({
            url: this.url + `/${team._id}`,
            dataType: 'json',
            data: JSON.stringify(team),
            contentType: 'application/json',
            type: 'PUT',
        })
    }

    static deleteTeam(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "Delete"
        })
    }
}

class DOMManager {
    static teams;

    static getAllTeams() {
        TeamService.getAllTeams().then((teams) => {this.render(teams)});
    }

    static createTeam(name) {
        TeamService.createTeam(new Team(name))
        .then(() => {
            return TeamService.getAllTeams();
        })
        .then((teams) => this.render(teams));
        document.getElementById('new-team-name').value = '';
    }

    static addPlayer(id) {
        for (let team of this.teams) {
            if (team._id == id) {
                team.players.push(
                    new Player(
                        $(`#${team._id}-player-name`).val(),
                        $(`#${team._id}-player-position`).val()
                    )
                );
                TeamService.updateTeam(team)
                .then(() => {
                    return TeamService.getAllTeams();
                })
                .then((teams) => this.render(teams));
            }
        }
    }

    static deletePlayer(teamId, playerId) {
        for (let team of this.teams) {
            if (team._id == teamId) {
                for (let player of team.players) {
                    if (player.name == playerId) {
                        team.players.splice(team.players.indexOf(player.name), 1);
                        TeamService.updateTeam(team)
                        .then(() => {
                            return TeamService.getAllTeams();
                        })
                        .then((teams) => this.render(teams));
                    }
                }
            }
        }
    }

    static deleteTeam(id) {
        TeamService.deleteTeam(id)
        .then(() => {
            return TeamService.getAllTeams();
        })
        .then((teams) => this.render(teams));
    }

    static render(teams) {
        this.teams = teams;
        $('#app').empty();
        for (let team of teams) {
            $('#app').prepend(
                `<div id="${team._id}" class="card">
                  <div class="card-header">
                   <h2>${team.name}</h2>
                   <button class="btn btn-danger" onclick="DOMManager.deleteTeam('${team._id}')">Delete</button>
                  </div>
                  <div class="card-body">
                    <div class="card">
                     <div class="row">
                      <div class="col-sm">
                        <input type="tex" id="${team._id}-player-name" class="form-control" placeholder="Player Name">
                      </div>
                      <div class="col-sm">
                        <input type="tex" id="${team._id}-player-position" class="form-control" placeholder="Player Position">
                      </div>
                     </div>
                      <button id="${team._id}-new-player" onclick="DOMManager.addPlayer('${team._id}')" class="btn btn-primary form-control">Add</button>
                    </div> 
                  </div>
                 </div><br>`
            );
            for(let player of team.players) {
                $(`#${team._id}`).find(`.card-body`).append(
                    `<p>
                       <span id="name-${player._id}"><strong>Name: </strong> ${player.name}</span>
                       <span id="position-${player._id}"><strong>Position: </strong> ${player.position}</span>
                       <button class="btn btn-danger" onclick="DOMManager.deletePlayer('${team._id}', '${player.name}')">Delete Player</button>`
                );
            }
        }
    }
}

$("#create-new-team").click(() => {
    DOMManager.createTeam($("#new-team-name").val());
    $("#new-team-naem").val("");
});

DOMManager.getAllTeams();