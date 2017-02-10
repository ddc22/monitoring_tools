var casper = require('casper').create({
    verbose: true,
    logLevel: "info"
});

var picOutputs = "./output/"
var URL_ACC_HISTORY = "https://www.commercialbk.com/online/2/6/1/261001.aspx";
var locationLogs = 0;

var fs = require('fs');


casper.on('remote.message', function(message) {
    	console.log("::REMOTE:: "+message);
});
casper.start('https://www.commercialbk.com/online/2/2/22001.aspx');

var api ={};
api.checkIfLoginFlowStepSucceeded = function(messages){
	casper.log('Check if logging step succeeded', 'info');
	if(messages.indexOf("strong") >= 0){
		casper.log('[TRACE] Login step error detected');
		casper.warn(messages);
		casper.exit();
		return false;
	} else {
		casper.log('[TRACE] Login flow step succeeded', 'info');
		return true;
	}

}

var initAndSubmitUsername = function (){
    casper.echo('First Page: ' + this.getTitle());
    casper.capture(picOutputs + '1_pic_landeds.png');
    casper.evaluate(function(){
    	console.log(this.navigator.userAgent);
    });
    
	casper.evaluate(function(username) {
	    casper.log('[TRACE] Filling username and submitting', 'info');
		document.querySelector('#ctl00_cphLogin_txtLoginID').value = username; 
		document.querySelector('#ctl00_cphLogin_btnSubmit').click();
	},username);

	casper.wait(2000,submitPassword);
}

var submitPassword = function(){
	casper.log("About to insert password");
	casper.capture(picOutputs +'2_pic_pass_page.png');
    casper.log("[TRACE] Captured pic","info");	
	var messages = casper.evaluate(function() {
		return document.getElementById("ctl00_cphLogin_lblMessages").innerHTML;
	});

	if(api.checkIfLoginFlowStepSucceeded(messages)){
		casper.log("[TRACE] Second Page: " + this.getTitle(), "info");
		casper.evaluate(function(pass) {
	    	document.querySelector('#ctl00_cphLogin_keyboard').value = pass;
	    	document.querySelector('#ctl00_cphLogin_btnSubmit').click();
		},password);
		casper.wait(2000,afterLoggedInStep);
	}
}

var afterLoggedInStep = function(){
	casper.log("[TRACE] After Login button clicked","info");
	var messages = casper.evaluate(function() {
		return document.getElementById("ctl00_cphLogin_lblMessages").innerHTML;
	});
	if(api.checkIfLoginFlowStepSucceeded(messages)){
		casper.capture(picOutputs +'3_pic_logged.png');
		casper.log("[TRACE] Third Page: " + this.getTitle(), "info");
		casper.open(URL_ACC_HISTORY);
		casper.wait(2000,logCurrentLocation);
		casper.wait(4000,logOut);
	}	


}

var logCurrentLocation = function(){
	var currentLocation = casper.getCurrentUrl();
	locationLogs +=1;
	casper.log("[TRACE] This is LOCLOG : ("+ locationLogs + ") : of : " + this.getCurrentUrl(),"info");	
	casper.capture(picOutputs +'LOC_current.png');
    casper.log("[TRACE] Captured Current location pic","info");		
}

var logOut = function(){
	casper.log('[TRACE] Logging out!', "info");
	casper.evaluate(function(pass) {
    	document.querySelector('#ctl00_lnkBtnSignOff').click();
	},password);
    casper.exit();		
}

casper.then(initAndSubmitUsername);
casper.run();