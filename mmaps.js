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
    setInterval(animateImage, 100);
  });

  chart.draw(data, options);
  google.visualization.events.addListener(chart, 'select', function selectHandler() {
    var selected = chart.getSelection()[0];
    if (! selected)
      return;
    var film = films[selected.row];
    window.location = film[2];
  });
}

function initMap() {
  google.charts.load('current', {'packages':['geochart']});
  google.charts.setOnLoadCallback(drawRegionsMap);
}

var imageCache = [];
var imageIndex = 0;

function displayFilm(film) {
  var url = film[2];
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

  var index = imageIndex++;
  
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
	  var match = result.match("^.+?src=\"(https://larsmagne23.files.wordpress.com[^\"]*shot[^\"]*)\"");
	  if (match) {
	    images.push(match[1]);
	    result = result.substring(match[0].length);
	  }
	} while (match);
	imageCache[url] = images;
	displayImage(url, index);
      }
    });
  }
}

var animatedImages = [];

function displayImage(url, index) {
  var images = imageCache[url];
  var src = images[Math.floor(Math.random()*images.length)];
  var image = document.createElement("img");
  image.src = src;
  var div = document.createElement("span");
  image.style.marginTop = "-30px";
  image.style.marginLeft = "-80px";
  div.className = "circular";
  div.appendChild(image);
  div.style.position = "absolute";
  div.style.zIndex = "" + index;
  div.style.display = "none";
  div.style.left = "80px";
  div.style.top = "350px";
  image.onload = function() {
    $(div).fadeIn(300);
    animatedImages[index] = image;
  };
  $("#inner").append(div);
}

var moveLeft = true;
var moveDown = true;

function animateImage() {
  for (var i = animatedImages.length - 1; i >= 0; i--) {
    var image = animatedImages[i];
    if (image.style.marginLeft)
      break;
    else
      image = false;
  }
  if (! image)
    return;
  var left = parseInt(image.style.marginLeft.replace(/px/, ""));
  var top = parseInt(image.style.marginTop.replace(/px/, ""));
  var width = image.width;
  var height = image.height;
  console.log([top, left, width, height]);

  if (moveLeft) {
    left += 1;
    if (left >= 0)
      moveLeft = false;
  } else {
    left -= 1;
    if (Math.abs(left) >= width / 2)
      moveLeft = true; 
  }

  /*
  if (moveDown) {
    top -= 1;
    if (height + top - 150 <= 0) {
      moveDown = true;
      top = 0;
    }
  } else {
    top += 1; 
    if (top + 150 > height) {
      moveDown = false;
      top = height - 150;
    }
  }
   */

  $(image).animate({marginLeft: left + "px",
		    marginTop: top + "px"},
		   10);
}
