function drawRegionsMap() {
  var ratingType = window.location.href.match("rating=([a-zA-Z]+)");
  if (ratingType) {
    ratingType = ratingType[1];
    var table = [['Country', ratingType + ' Rating']];
    if (ratingType == "Film")
      var axis = {minValue: 300, colors: ['#300000', '#d00000']};
    else
      axis = {minValue: 300, colors: ['#000080', '#0000e0']};
    $.map(films, function(film) {
      var index = ratingType == "Film"? 6: 7;
      table.push([film[0], film[index] * 75 + 300]);
    });
  } else {
    table = [['Country', 'Newness']];
    var points = 700;
    var step = 200;
    var match = window.location.href.match("country=([a-z]+)");
    if (match)
      var start = match[1];
    var found = false;
    axis = {minValue: 300, colors: ['#002000', '#00ff00']};
    
    if (! start) {
      found = true;
      points = 300;
      axis = {minValue: 300, colors: ['#004000', '#004000']};
    }
    
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
  }

  var data = google.visualization.arrayToDataTable(table);

  var options = {
    backgroundColor: "#000000",
    datalessRegionColor: "#000000",
    colorAxis: axis,
    tooltip: { trigger: "focus", isHtml: true },
    legend: "none"
  };

  var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

  google.visualization.events.addListener(chart, 'ready', function selectHandler() {
    $("path").each(function() {
      // Erase the borders between the countries.
      if (this.getAttribute("fill") == "#002000")
	this.setAttribute("stroke", "#002000");
    });
    // Remove the crosshatching in India.
    for (var i = 0; i < 10; i++)
      $("#_ABSTRACT_RENDERER_ID_" + i).remove();
    $("path").each(function() {
      $(this).hover(function() {
	$(".google-visualization-tooltip").find("span").first().each(function() {
	  var html = this.innerHTML;
	  if (html.length == 2) {
	    $.map(films, function(film) {
	      if (film[0] == html)
		displayFilm(film);
	    });
	  }
	});
      });
    });

    google.visualization.events.addListener(
      chart, 'select',
      function selectHandler(e) {
	console.log(e);
	var selected = chart.getSelection()[0];
	if (! selected)
	  return;
	var film = films[selected.row];
	window.location = film[2];
      });

  });

  chart.draw(data, options);
}

function initMap() {
  google.charts.load('45', {'packages':['geochart']});
  google.charts.setOnLoadCallback(drawRegionsMap);
}

var imageCache = [];
var imageIndex = 0;

function displayFilm(film) {
  var url = film[2];
  currentUrl = url;
  $(".event-lightbox").remove();
  var html = "<a href=\"" + url + "\">" + film[1] +
	" (" + film[3] + ") by "
	+ film[4] + "</a><br><span>" + film[5] + "</span>";
  var box = document.createElement("div");
  box.style.left = "280px";
  box.style.top = "80px";
  box.className = "event-lightbox";
  box.innerHTML = "<div>" + html + "</div>";
  $("#inner").append(box);
  $(".close").bind("click", function() {
    $(box).remove();
  });

  var index = ++imageIndex;
  
  if (imageCache[url])
    displayImage(url, index);
  else {
    imageCache[url] = [];
    $.ajax({
      url: url.replace(/^http:/, "https:"),
      crossOrigin: true,
      dataType: "html",
      success: function(result) {
	result = result.replace(/\n/g, "");
	var images = [];
	do {
	  var match = result.match("src=\"(https://lars.ingebrigtsen.no[^\"]*shot[^\"]*)\"");
	  if (match) {
	    images.push(match[1]);
	    result = result.substring(match.index + match[0].length);
	  }
	} while (match);
	imageCache[url] = images;
	displayImage(url, index);
      }
    });
  }
}

var animatedImages = [];
var currentUrl = false;

function displayImage(url, index) {
  var images = imageCache[url];
  var image = document.createElement("img");
  image.src = images[Math.floor(Math.random()*images.length)];
  var imgcont = $("span.circular")[0];
  if (! imgcont) {
    imgcont = document.createElement("span");
    $("#inner").append(imgcont);
    imgcont.className = "circular";
    imgcont.style.position = "absolute";
    imgcont.style.left = "80px";
    imgcont.style.top = "350px";
    var wrap = document.createElement("span");
    imgcont.appendChild(wrap);
    wrap.style.marginTop = "0px";
    wrap.style.marginLeft = "0px";
    animateImage(wrap, true);
  } else {
    wrap = $(imgcont).find("span")[0];
  }
  wrap.appendChild(image);
  image.style.zIndex = "" + index;
  image.style.display = "none";
  image.onload = function() { fixImage(image, index); };
}

function fixImage(image, index) {
  var newHeight = 360 / image.width * image.height;
  image.style.height = newHeight + "px";
  $(image).fadeIn(500, function() {
    if (index == imageIndex) {
      $("img").each(function() {
	if (this != image)
	  $(this).remove();
      });
    }
  });
}


function animateImage(wrap, left) {
  if (left)
    var target = "-400px";
  else
    target = "0px";

  $(wrap).animate({marginLeft: target},
		  4000, false, function() {
		    animateImage(wrap, !left);
		    var images = imageCache[currentUrl];
		    var image = document.createElement("img");
		    image.src = images[Math.floor(Math.random()*images.length)];
		    image.style.zIndex = "" + ++imageIndex;
		    image.style.display = "none";
		    image.onload = function() { fixImage(image, imageIndex); };
		    wrap.appendChild(image);
		  });
}
