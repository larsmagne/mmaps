var films = [
  ["de", "Die Patronin", "http://lars.ingebrigtsen.no/foo/de"],
  ["ru", "Mirror", "http://lars.ingebrigtsen.no/foo/ru"],
  ["se", "Sångar från andre våningen", "http://lars.ingebrigtsen.no/foo/se"]
];

function drawRegionsMap() {
  var table = [['Country', 'Newness']];
  var points = 700;

  $.map(films, function(film) {
    table.push([film[0], points]);
    if (points > 300)
      points -= 10;
  });

  console.log(table);
  
  var data = google.visualization.arrayToDataTable(table);

  var options = {
    backgroundColor: "#000000",
    datalessRegionColor: "#000000",
    tooltip: { trigger: "none" }
  };

  var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

  chart.draw(data, options);
  google.visualization.events.addListener(chart, 'select', function selectHandler() {
    var selected = chart.getSelection()[0];
    if (! selected)
      return;
    console.log(selected.row);
  });
}

function initMap() {
  google.charts.load('current', {'packages':['geochart']});
  google.charts.setOnLoadCallback(drawRegionsMap);
}

