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
    static url = "https://ancient-taiga-31359.herokuapp.com/api/teams";

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
            type: 'PUT'
        })
    }

    static deleteTeam(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        })
    }
}

class DOMManager {
    static teams;

    static getAllTeams() {
        TeamService.getAllTeams().then(teams => this.render(teams));
    }

    static render(teams) {
        this.teams = teams;
        $('#app').empty();
        for (let team of teams) {
            $('#app').prepend(
                `<div id="${team._id}" class="card">
                  <div class="card-header">
                   <h2>${team.name}</h2>
                  </div>
                 </div>
                `
            );
        }
    }
}

DOMManager.getAllTeams();