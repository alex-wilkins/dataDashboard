
  var FixtureTableHome = {}
  var FixtureTableAway = {}


  // This makes the GET request for the fixtures
  $.ajax({
    url: 'http://api.football-data.org/v1/competitions/445/fixtures?matchday=20',
    headers: {
      'X-Auth-Token': '8482449714f3462da05ecdf6435cc71b'
    },
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      console.log(data)
      handleData(data)
    },

  });


  function handleData(data) {
    // LeagueTable = data
      console.log(data)
    for (i = 0; i < 10; i++) {
      FixtureTableHome[i] = data.fixtures[i].homeTeamName
      FixtureTableAway[i] = data.fixtures[i].awayTeamName
      document.getElementById('Fixture' + (i+1)).innerHTML = FixtureTableHome[i] + "<br />" + " vs. " + "<br />" + FixtureTableAway[i];
      document.getElementById('Fixture' + (i+1)).style.fontSize = "15px";
    }
  }
