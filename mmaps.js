var films = [
  ["de", "Die Patronin", "http://lars.ingebrigtsen.no/foo/de"],
  ["ru", "Mirror", "http://lars.ingebrigtsen.no/foo/ru", "1976", "Andrei Tarkovski"],
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

  var data = google.visualization.arrayToDataTable(table);

  var options = {
    backgroundColor: "#000000",
    datalessRegionColor: "#000000",
    colorAxis: {colors: ['#505050', '#00ff00']},
    tooltip: { trigger: "none" },
    legend: "none"
  };

  var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

  chart.draw(data, options);
  google.visualization.events.addListener(chart, 'select', function selectHandler() {
    var selected = chart.getSelection()[0];
    if (! selected)
      return;
    displayFilm(films[selected.row]);
  });
}

function initMap() {
  google.charts.load('current', {'packages':['geochart']});
  google.charts.setOnLoadCallback(drawRegionsMap);
}

function displayFilm(film) {
  var html = "<a href=\"" + film[2] + "\">" + film[1] +
	" (" + film[3] + ") by "
	+ film[4] + "</a>";
  var box = document.createElement("div");
  box.style.position = "absolute";
  box.style.left = $(window).width() / 2 - 150 + "px";
  box.style.top = $(window).height() / 2 - 25 + "px";
  box.style.height = "50px";
  box.style.width = "300px";
  box.style.display = "block";
  box.style.background = "#f0f0f0";
  box.style.color = "black";
  box.className = "event-lightbox";
  box.innerHTML = html + "<div class='close'><span>Close</span></div>";
  document.body.appendChild(box);
  $(".close").bind("click", function() {
    $(box).remove();
  });
}
