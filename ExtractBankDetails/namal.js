var casper = require('casper').create({
    verbose: true,
    logLevel: "info"
});
var fs = require('fs');

var picOutputs = "/home/ubuntu/Projects/monitoring_tools/ExtractBankDetails/output-namal/"
var namal = "http://www.namalfunds.com/fund-prices.html";
var locationLogs = 0;

var fs = require('fs');


casper.on('remote.message', function(message) {
    	console.log("::REMOTE:: "+message);
});
casper.start(namal);



var landingPage = function (){
    casper.echo('First Page: ' + this.getTitle());
    casper.capture(picOutputs + '1_pic_landeds.png');
    casper.evaluate(function(){
    	console.log(this.navigator.userAgent);
    });
    var info = casper.evaluate(function(){
        var table_rows = document.querySelectorAll("tr"); //or better selector
        var i = null;
        var returnVals =[];
        for(i in table_rows){
        	if(table_rows[i].children){
        		for(j in table_rows[i].children){
        			if(table_rows[i].children[j].textContent){
						//console.log(table_rows[i].children[j].textContent);
						returnVals.push(table_rows[i].children[j].textContent);
					}
				}
			}
        }
        return returnVals;
    });
    var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var myfile = picOutputs + "data-"+year + "-" + month + "-" + day+".txt";
	var csvFile = picOutputs + "data.csv";

	fs.write(myfile, JSON.stringify(info, undefined, 4), 'w');


	

	var line = "";
	var efectiveInfo = info.slice(3);
	for(var i in efectiveInfo){
		line +=efectiveInfo[i];
		if((i+1) %  3 == 0){
			var rightNow = new Date();
			casper.echo('HIT');
			var rightNowString = rightNow.toISOString();
			var rightNowDate = rightNowString.slice(0,10);

			fs.write(csvFile, rightNowString+","+rightNowDate+","+line+"\n", 'a');
			line ="";
		} else {
			line +=",";
		}
		
	}
	

	//casper.wait(2000,submitPassword);
}


casper.then(landingPage);
casper.run();
