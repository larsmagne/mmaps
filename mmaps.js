function drawRegionsMap() {
  var table = [['Country', 'Newness']];
  var points = 700;
  var step = 200;
  var match = window.location.href.match("country=([a-z]+)");
  if (match)
    var start = match[1];
  var found = false;

  if (! start)
    found = true;
  
  $.map(films, function(film) {
    if (film[0] == start)
      found = true;
    if (! found)
      return;
    table.push([film[0], points]);
    if (points > 300)
      points -= step;
    step = 50;
  });

  var data = google.visualization.arrayToDataTable(table);

  var options = {
    backgroundColor: "#000000",
    datalessRegionColor: "#000000",
    colorAxis: {minValue: 300, colors: ['#002000', '#00ff00']},
    tooltip: { trigger: "none" },
    legend: "none"
  };

  var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

  google.visualization.events.addListener(chart, 'ready', function selectHandler() {
    $("path").each(function(index) {
      // Erase the borders between the countries.
      if (this.getAttribute("fill") == "#002000")
	this.setAttribute("stroke", "#002000");
    });
    // Remove the crosshatching in India.
    for (var i = 0; i < 10; i++)
      $("#_ABSTRACT_RENDERER_ID_" + i).remove();
  });

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
  $(".event-lightbox").remove();
  var html = "<a href=\"" + film[2] + "\">" + film[1] +
	" (" + film[3] + ") by "
	+ film[4] + "</a><p>" + film[5];
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
