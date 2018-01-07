function fixtures() {
  var FixtureTableHome = {}
  var FixtureTableAway = {}
  var data = document.getElementById("MatchdayForm").value;

console.log(data)
  // This makes the GET request for the fixtures
  $.ajax({
    url: 'http://api.football-data.org/v1/competitions/445/fixtures?matchday=' + data,
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
      var matchdate = data.fixtures[i].date.substring(0, 10);
      var matchtime = data.fixtures[i].date.substring(11, 16);
      FixtureTableHome[i] = data.fixtures[i].homeTeamName;
      FixtureTableAway[i] = data.fixtures[i].awayTeamName;
      document.getElementById('Fixture' + (i+1)).innerHTML = FixtureTableHome[i] + "<br />" + " vs. " + "<br />" + FixtureTableAway[i] +"<br />" + matchtime + ", " + matchdate;
      document.getElementById('Fixture' + (i+1)).style.fontSize = "15px";
    }
  }
}

function RevenueStream() {
     var chart = c3.generate({
       bindto: '#Revenue',
          data: {
              x: 'Club',
              columns: [
                 ['Club','Man Utd','Man City','Arsenal','Chelsea','Liverpool','Tottenham Hotspur','West Ham United','Newcastle United','Everton','Southampton','Leicester City','Stoke City','Crystal Palace','West Bromwich','Swansea','Watford','Bournemouth','Burnley','Brighton & Hove','Huddersfield'  ],
                 ['Match Day',107,53,100,70,62,41,27,25,18,19,12,8,12,8,8,8,5,5,9.4,3.2  ],
                 ['Broadcasting & Media',140,161,141,143,124,94,87,73,83,90,96,79,78,79,79,80,75,29.6,5.9,4.99  ],
                 ['Commercial & Sponsorship',268,178,110,122,116,59,28,28,21,12,7,16,10,12,10,3,2,5.4,8.1,2.4  ],
                 ['Other',0,0,3,0,0,16,0,0,0,0,0,0,2,0,0,4,1,0,1.18,1.1  ]
                    ],
              type: 'bar',
              groups: [
                  ['Match Day', 'Broadcasting & Media','Commercial & Sponsorship','Other' ]
              ]
          },
          axis: {
              rotated: true,
              x: {
                  type: 'category'
              },
              y:{
                label: '£ million'
              }
          },
      });
}

function MapDraw() {
  var locations = [
    ['Brighton & Hove Albion’s American Express Community Stadium', 50.861822, -0.083278],
    ['Liverpool’s Anfield', 53.430833, -2.960833],
    ['Stoke City’s bet365 Stadium', 52.988333, -2.175556],
    ['Arsenal’s Emirates Stadium', 51.5548885,-0.108438],
    ['Everton’s Goodison Park', 53.438889, -2.966389],
    ['West Bromwich Albion’s The Hawthorns', 52.509167, -1.963889],
    ['Huddersfield Town’s John Smith’s Stadium', 53.654167, -1.768333],
    ['Leicester City’s King Power Stadium', 52.620278, -1.142222],
    ['West Ham United’s London Stadium', 51.538611, -0.016389],
    ['Manchester United’s Old Trafford', 53.463056, -2.291389],
    ['Newcastle United’s James Park', 54.975556, -1.621667],
    ['Southampton’s St Mary’s stadium' , 50.905833, -1.391111],
    ['Crystal Palace’s Selhurst Park', 51.398333, -0.085556],
    ['Chelsea’s Stamford Bridge', 51.481667, -0.191111],
    ['Burnley’s Turf Moor', 53.789167, -2.230278],
    ['Watford’s Vicarage Road', 51.65, -0.401667],
    ['Bournemouth’s Vitality Stadium', 50.735278, -1.838333],
    ['Tottenham Hotspurs’s Wembley Stadium', 51.555833, -0.279722],
    ['Manchester City’s Etihad Stadium', 53.483056, -2.200278],
    ['Swansea City’s Liberty Stadium', 51.642778, -3.934722]
      ];


      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(53.483959, -2.244644),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infowindow = new google.maps.InfoWindow();

      var marker, i;

      for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
          }
        })(marker, i));
      }



  function calculateRoute(from, to) {
    // Center initialized somewhere near London
    var myOptions = {
      zoom: 10,
      center: new google.maps.LatLng(53, -1),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Draw the map
    var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
    var markerArray = [];
    var showSteps = new google.maps.DirectionsRenderer({map: map});
    var stepDisplay = new google.maps.DirectionsRenderer({map: map})
    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
      origin: from,
      destination: to,
      travelMode: google.maps.DirectionsTravelMode.TRANSIT,
      unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(
      directionsRequest,
      function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          new google.maps.DirectionsRenderer({
            map: mapObject,
            directions: response,
            suppressMarkers: true
          });
          console.log(response.routes.length);
          createMarker(response.routes[0].legs[0].start_location, "start", document.getElementById('from').value, "green", "A", mapObject);
          createMarker(response.routes[0].legs[0].end_location, "end", $("#to option:selected").text(), "red", "B", mapObject)
        } else
          $("#error").append("Unable to retrieve your route<br />");
      }
    );
  }

  $(document).ready(function() {
    // If the browser supports the Geolocation API
    if (typeof navigator.geolocation == "undefined") {
      $("#error").text("Your browser doesn't support the Geolocation API");
      return;
    }

    function showSteps(directionResult,markerArray, stepDisplay, map) {
      // For each step, place a marker, and add the text to the marker's
      // info window. Also attach the marker to an array so we
      // can keep track of it and remove it when calculating new
      // routes.
      var myRoute = directionResult.routes[0].legs[0];
          for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
            marker.setMap(map);
            marker.setPosition(myRoute.steps[i].start_location);
            attachInstructionText(
                stepDisplay, marker, myRoute.steps[i].instructions, map);
          }
        }


        function attachInstructionText(stepDisplay, marker, text, map) {
                google.maps.event.addListener(marker, 'click', function() {
                  // Open an info window when the marker is clicked on, containing the text
                  // of the step.
                  stepDisplay.setContent(text);
                  stepDisplay.open(map, marker);
                });
              }


    $("#from-link, #to-link").click(function(event) {
      event.preventDefault();
      var addressId = this.id.substring(0, this.id.indexOf("-"));

      navigator.geolocation.getCurrentPosition(function(position) {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({
              "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            },
            function(results, status) {
              if (status == google.maps.GeocoderStatus.OK)
                $("#" + addressId).val(results[0].formatted_address);
              else
                $("#error").append("Unable to retrieve your address<br />");
            });
        },


        function(positionError) {
          $("#error").append("Error: " + positionError.message + "<br />");
        }, {
          enableHighAccuracy: true,
          timeout: 10 * 1000 // 10 seconds
        });
    });

    $("#calculate-route").submit(function(event) {
      event.preventDefault();
      calculateRoute($("#from").val(), $("#to").val());
    });
  });
  var icons = new Array();
  icons["red"] = {
    url: "http://maps.google.com/mapfiles/ms/micons/red.png",
    // This marker is 32 pixels wide by 32 pixels tall.
    size: new google.maps.Size(32, 32),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is at 9,34.
    anchor: new google.maps.Point(16, 32),
    labelOrigin: new google.maps.Point(16, 10)
  };

  function getMarkerImage(iconColor) {
    if ((typeof(iconColor) == "undefined") || (iconColor == null)) {
      iconColor = "red";
    }
    if (!icons[iconColor]) {
      icons[iconColor] = {
        url: "http://maps.google.com/mapfiles/ms/micons/" + iconColor + ".png",
        // This marker is 32 pixels wide by 32 pixels tall.
        size: new google.maps.Size(32, 32),
        // The origin for this image is 0,0.
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is at 6,20.
        anchor: new google.maps.Point(16, 32),
        labelOrigin: new google.maps.Point(16, 10)
      };
    }
    return icons[iconColor];

  }
  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.

  var iconImage = {
    url: 'http://maps.google.com/mapfiles/ms/micons/red.png',
    // This marker is 20 pixels wide by 34 pixels tall.
    size: new google.maps.Size(20, 34),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is at 9,34.
    anchor: new google.maps.Point(9, 34)
  };
  // Shapes define the clickable region of the icon.
  // The type defines an HTML &lt;area&gt; element 'poly' which
  // traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first
  // coordinate.
  var iconShape = {
    coord: [9, 0, 6, 1, 4, 2, 2, 4, 0, 8, 0, 12, 1, 14, 2, 16, 5, 19, 7, 23, 8, 26, 9, 30, 9, 34, 11, 34, 11, 30, 12, 26, 13, 24, 14, 21, 16, 18, 18, 16, 20, 12, 20, 8, 18, 4, 16, 2, 15, 1, 13, 0],
    type: 'poly'
  };
  var infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(150, 50)
  });

  function createMarker(latlng, title, html, color, label, map) {
    var contentString = html ;
    var marker = new google.maps.Marker({
      position: latlng,
      draggable: true,
      map: map,
      icon: getMarkerImage(color),
      shape: iconShape,
      title: title,
      label: label,
      zIndex: Math.round(latlng.lat() * -100000) << 5
    });
    marker.myname = title;
    // gmarkers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });

    return marker;
  }

}


function HistoricalChart() {
  //count sets the number of teams
  var Matchweek= 23
  var count = 20
  var requests = new Array()

  //This generates an array of get requests
  for (i=1; i<Matchweek; i++) {
    requests[i] = d3version4.request("http://api.football-data.org/v1/competitions/445/leagueTable/?matchday=" + i)
    .header("X-Auth-Token", "8482449714f3462da05ecdf6435cc71b")
  }

  var q = d3version4.queue();
  //This uses the d3 queue function to make 16 get requests for the data, and
  //then once all the data is retrieved (awaitAll), it excutes the callback function
    for (i=1; i<Matchweek; i++) {
    q.defer(requests[i].get);
  }
    q.awaitAll(function(error, files) {
    if (error) throw error;
    //This converts the retrieved files to a JSON called Matchdays, which is
    //all the previous weeks' results
    var Matchdays = new Array()
    for(i=0; i<Matchweek-1; i++) {
      Matchdays[i] = files[i].response
      Matchdays[i] = JSON.parse(Matchdays[i])
    }
    console.log(Matchdays)
  //This is used to select the array that contains a team's position for a particular
  //matchweek
    function findTeamEntry(array, key, value) {
      for (var i = 0; i < array.length; i++) {
          if (array[i][key] === value) {
              return array[i];
          }
      }
      return null;
  }

  // This makes the table in the required format for c3.js
  var PremierTable = new Array()
  n=1
    for(i=0; i<count-1; i++) {
      function findTeamPosition(Team, n) {
      var obj = findTeamEntry(Matchdays[n].standing, 'teamName', Team)
      return obj.position
      }
      PremierTable[i]= [Matchdays[0].standing[i].teamName, Matchdays[0].standing[i].position, findTeamPosition(Matchdays[0].standing[i].teamName, n), findTeamPosition(Matchdays[0].standing[i].teamName, n+1),findTeamPosition(Matchdays[0].standing[i].teamName, n+2),
      findTeamPosition(Matchdays[0].standing[i].teamName, n+3),findTeamPosition(Matchdays[0].standing[i].teamName, n+4),findTeamPosition(Matchdays[0].standing[i].teamName, n+5),findTeamPosition(Matchdays[0].standing[i].teamName, n+6),findTeamPosition(Matchdays[0].standing[i].teamName, n+7),
      findTeamPosition(Matchdays[0].standing[i].teamName, n+8),findTeamPosition(Matchdays[0].standing[i].teamName, n+9),findTeamPosition(Matchdays[0].standing[i].teamName, n+10),
      findTeamPosition(Matchdays[0].standing[i].teamName, n+11),findTeamPosition(Matchdays[0].standing[i].teamName, n+12),findTeamPosition(Matchdays[0].standing[i].teamName, n+13),findTeamPosition(Matchdays[0].standing[i].teamName, n+14),findTeamPosition(Matchdays[0].standing[i].teamName, n+15),
      findTeamPosition(Matchdays[0].standing[i].teamName, n+16),findTeamPosition(Matchdays[0].standing[i].teamName, n+17),findTeamPosition(Matchdays[0].standing[i].teamName, n+18),findTeamPosition(Matchdays[0].standing[i].teamName, n+19),
      findTeamPosition(Matchdays[0].standing[i].teamName, n+20)]
  }

  //This draws the chart I want
  function drawChart(PremierTable) {

    var chart = c3.generate({
      bindto:'#HistoricalChart',
      size: {height:400,

      },
        data: {
            columns:
              PremierTable
              },
            colors: {
              "Manchester United FC" : '#ff0000',
            },
            tooltip: {
              title: function (d) { return 'Matchweek ' + 1; },
              grouped: false
  },

              axis: {
            y: {
              inverted: true,
              max: 20,
              min: 1,
              padding: {top:0, bottom: 0},
              tick: {count:20},
            },

            x: {
              // tick: {count:16 },
              // min: 1,
              // padding: {bottom:0},
            }
          },
            })

        }

  drawChart(PremierTable)
  })



}

function MapDraw() {
  var locations = [
    ['Brighton & Hove Albion’s American Express Community Stadium', 50.861822, -0.083278],
    ['Liverpool’s Anfield', 53.430833, -2.960833],
    ['Stoke City’s bet365 Stadium', 52.988333, -2.175556],
    ['Arsenal’s Emirates Stadium', 51.5548885,-0.108438],
    ['Everton’s Goodison Park', 53.438889, -2.966389],
    ['West Bromwich Albion’s The Hawthorns', 52.509167, -1.963889],
    ['Huddersfield Town’s John Smith’s Stadium', 53.654167, -1.768333],
    ['Leicester City’s King Power Stadium', 52.620278, -1.142222],
    ['West Ham United’s London Stadium', 51.538611, -0.016389],
    ['Manchester United’s Old Trafford', 53.463056, -2.291389],
    ['Newcastle United’s James Park', 54.975556, -1.621667],
    ['Southampton’s St Mary’s stadium' , 50.905833, -1.391111],
    ['Crystal Palace’s Selhurst Park', 51.398333, -0.085556],
    ['Chelsea’s Stamford Bridge', 51.481667, -0.191111],
    ['Burnley’s Turf Moor', 53.789167, -2.230278],
    ['Watford’s Vicarage Road', 51.65, -0.401667],
    ['Bournemouth’s Vitality Stadium', 50.735278, -1.838333],
    ['Tottenham Hotspurs’s Wembley Stadium', 51.555833, -0.279722],
    ['Manchester City’s Etihad Stadium', 53.483056, -2.200278],
    ['Swansea City’s Liberty Stadium', 51.642778, -3.934722]
      ];


      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(53.483959, -2.244644),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infowindow = new google.maps.InfoWindow();

      var marker, i;

      for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
          }
        })(marker, i));
      }



  function calculateRoute(from, to) {
    // Center initialized somewhere near London
    var myOptions = {
      zoom: 10,
      center: new google.maps.LatLng(53, -1),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    // Draw the map
    var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
    var markerArray = [];
    var showSteps = new google.maps.DirectionsRenderer({map: map});
    var stepDisplay = new google.maps.DirectionsRenderer({map: map})
    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
      origin: from,
      destination: to,
      travelMode: google.maps.DirectionsTravelMode.TRANSIT,
      unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(
      directionsRequest,
      function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          new google.maps.DirectionsRenderer({
            map: mapObject,
            directions: response,
            suppressMarkers: true
          });
          console.log(response.routes.length);
          createMarker(response.routes[0].legs[0].start_location, "start", document.getElementById('from').value, "green", "A", mapObject);
          createMarker(response.routes[0].legs[0].end_location, "end", $("#to option:selected").text(), "red", "B", mapObject)
        } else
          $("#error").append("Unable to retrieve your route<br />");
      }
    );
  }

  $(document).ready(function() {
    // If the browser supports the Geolocation API
    if (typeof navigator.geolocation == "undefined") {
      $("#error").text("Your browser doesn't support the Geolocation API");
      return;
    }

    function showSteps(directionResult,markerArray, stepDisplay, map) {
      // For each step, place a marker, and add the text to the marker's
      // info window. Also attach the marker to an array so we
      // can keep track of it and remove it when calculating new
      // routes.
      var myRoute = directionResult.routes[0].legs[0];
          for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
            marker.setMap(map);
            marker.setPosition(myRoute.steps[i].start_location);
            attachInstructionText(
                stepDisplay, marker, myRoute.steps[i].instructions, map);
          }
        }


        function attachInstructionText(stepDisplay, marker, text, map) {
                google.maps.event.addListener(marker, 'click', function() {
                  // Open an info window when the marker is clicked on, containing the text
                  // of the step.
                  stepDisplay.setContent(text);
                  stepDisplay.open(map, marker);
                });
              }


    $("#from-link, #to-link").click(function(event) {
      event.preventDefault();
      var addressId = this.id.substring(0, this.id.indexOf("-"));

      navigator.geolocation.getCurrentPosition(function(position) {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({
              "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            },
            function(results, status) {
              if (status == google.maps.GeocoderStatus.OK)
                $("#" + addressId).val(results[0].formatted_address);
              else
                $("#error").append("Unable to retrieve your address<br />");
            });
        },


        function(positionError) {
          $("#error").append("Error: " + positionError.message + "<br />");
        }, {
          enableHighAccuracy: true,
          timeout: 10 * 1000 // 10 seconds
        });
    });

    $("#calculate-route").submit(function(event) {
      event.preventDefault();
      calculateRoute($("#from").val(), $("#to").val());
    });
  });
  var icons = new Array();
  icons["red"] = {
    url: "http://maps.google.com/mapfiles/ms/micons/red.png",
    // This marker is 32 pixels wide by 32 pixels tall.
    size: new google.maps.Size(32, 32),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is at 9,34.
    anchor: new google.maps.Point(16, 32),
    labelOrigin: new google.maps.Point(16, 10)
  };

  function getMarkerImage(iconColor) {
    if ((typeof(iconColor) == "undefined") || (iconColor == null)) {
      iconColor = "red";
    }
    if (!icons[iconColor]) {
      icons[iconColor] = {
        url: "http://maps.google.com/mapfiles/ms/micons/" + iconColor + ".png",
        // This marker is 32 pixels wide by 32 pixels tall.
        size: new google.maps.Size(32, 32),
        // The origin for this image is 0,0.
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is at 6,20.
        anchor: new google.maps.Point(16, 32),
        labelOrigin: new google.maps.Point(16, 10)
      };
    }
    return icons[iconColor];

  }
  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.

  var iconImage = {
    url: 'http://maps.google.com/mapfiles/ms/micons/red.png',
    // This marker is 20 pixels wide by 34 pixels tall.
    size: new google.maps.Size(20, 34),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is at 9,34.
    anchor: new google.maps.Point(9, 34)
  };
  // Shapes define the clickable region of the icon.
  // The type defines an HTML &lt;area&gt; element 'poly' which
  // traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first
  // coordinate.
  var iconShape = {
    coord: [9, 0, 6, 1, 4, 2, 2, 4, 0, 8, 0, 12, 1, 14, 2, 16, 5, 19, 7, 23, 8, 26, 9, 30, 9, 34, 11, 34, 11, 30, 12, 26, 13, 24, 14, 21, 16, 18, 18, 16, 20, 12, 20, 8, 18, 4, 16, 2, 15, 1, 13, 0],
    type: 'poly'
  };
  var infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(150, 50)
  });

  function createMarker(latlng, title, html, color, label, map) {
    var contentString = html ;
    var marker = new google.maps.Marker({
      position: latlng,
      draggable: true,
      map: map,
      icon: getMarkerImage(color),
      shape: iconShape,
      title: title,
      label: label,
      zIndex: Math.round(latlng.lat() * -100000) << 5
    });
    marker.myname = title;
    // gmarkers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });

    return marker;
  }
}
