var page = require('webpage').create();
page.open('https://www.commercialbk.com/online/2/2/22001.aspx', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('example.png');
	var ua = page.evaluate(function() {
	     return document.getElementById('ctl00_cphLogin_txtLoginID').textContent="DECROO6";
	   });
	console.log(ua);
  }
  phantom.exit();
});
