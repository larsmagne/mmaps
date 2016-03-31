var page = require('webpage').create();
page.viewportSize = {
 width: 2048,
 height: 1600
};
page.open('file:///home/larsi/src/mmaps/mmaps.html', function() {
  window.setTimeout(function () {
    page.render('/tmp/mmaps.png');
    phantom.exit();
  }, 2000);
});
