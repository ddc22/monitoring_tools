var casper = require('casper').create({
    clientScripts:  [
        'includes/jquery.js',      // These two scripts will be injected in remote
        //'includes/underscore.js'   // DOM on every request
    ],
    pageSettings: {
        loadImages:  true,        // The WebPage instance used by Casper will
        loadPlugins: true         // use these settings
    },
    logLevel: "info",              // Only "info" level messages will be logged
    verbose: true                  // log messages will be printed out to the console
});
var mouse = require("mouse").create(casper);

var username = "";
var password = "";
var NAV_LOCATIONS_FOR_QUICKNAV = {
	AccountHistory              : "~/2/6/1/261001.aspx"		 	,
	AccountInquiry              : "~/2/3/1/231007.aspx"		 	,
	ActivateTwoFactor           : "~/2/6/3/1/2631005.aspx"	 	,
	BillPayments                : "~/2/3/10/2310002.aspx"    	,	      	 
	CardInquiriesSettlement 	: "~/2/3/2/232002.aspx"		 	,     
	ChangePassword              : "~/2/2/22004.aspx"			,       
	ChangePersonalInformation   : "~/2/6/3/1/2631004.aspx"	 	,     
	ChangeSecretQuestions       : "~/2/6/3/1/2631003.aspx"	 	,     
	ChequeBookRequest           : "~/2/3/6/236001.aspx"		 	,     
	ExchangeRates               : "~/2/3/3/233001.aspx"		 	,     
	FixedDeposits               : "~/2/3/13/2313004.aspx"		,       
	FundTransferOwn             : "~/2/3/11/2311001.aspx"		,          
	FundTransferThird           : "~/2/3/11/2311003.aspx"		,            		 
	LastStatementRequest        : "~/2/3/6/236004.aspx"		 	,     
	LoanRequest                 : "~/2/3/12/2312001.aspx"		,       
	LoginHistory                : "~/2/6/3/1/2631006.aspx"	 	,     
	MessageFromBank           	:"~/2/6/3/263002.aspx"		 	,     
	MessageToBank             	:"~/2/6/3/263001.aspx"		 	,     
	PriorStatement              : "~/2/6/1/261002.aspx"		 	,     
	PrioritizeAccounts          : "~/2/6/3/1/2631002.aspx"	 	,     
	ScheduledPayments           : "~/2/6/26004.aspx"		 	,	       
	SecureImageSetup            : "~/2/6/3/1/2631001.aspx"	 	,     
	ShareTradingSettlements     : "~/2/3/7/237001.aspx"		 	,     
	StandingOrders              : "~/2/3/8/238001.aspx"		 	,     
	TicketingFlightReservation  : "~/2/3/16/2316001.aspx"		,       
	TreasuryBills               : "~/2/3/4/234004.aspx"		 	,      
	UnrealizedFunds             : "~/2/3/9/239001.aspx"		
}             


casper.on('remote.message', function(message) {
    	console.log("::REMOTE:: "+message);
});


casper.on("click", function(){this.echo();});
casper.on("page.error", function(){this.echo();});

casper.start('https://www.commercialbk.com/online/2/2/22001.aspx');

var api ={};
api.checkIfLoginFlowStepSucceeded = function(messages){
	casper.log('Check if logging step succeeded', 'info');
	if(messages.indexOf("strong") >= 0){
		casper.warn('Login step error detected');
		casper.warn(messages);
		return false;
	} else {
		casper.log('Login flow step succeeded', 'info');
		return true;
	}

}

var initAndSubmitUsername = function (){
    this.echo('First Page: ' + this.getTitle());
    this.capture('./output/1_pic_landed.png');
    this.evaluate(function(){
    	console.log(this.navigator.userAgent);
    });
    
	casper.evaluate(function(username) {
	    console.log('Filling username and submitting');
		document.querySelector('#ctl00_cphLogin_txtLoginID').value = username; 
		document.querySelector('#ctl00_cphLogin_btnSubmit').click();
	},username);

	this.wait(2000,submitPassword);
}

var submitPassword = function(){
	this.echo("About to insert password");
	this.capture('./output/2_pic_pass_page.png');
	var messages = casper.evaluate(function() {
		return document.getElementById("ctl00_cphLogin_lblMessages").innerHTML;
	});

	if(api.checkIfLoginFlowStepSucceeded(messages)){
		this.echo('Second Page: ' + this.getTitle());
		if(casper.getTitle().indexOf("Authentication") < 0){
			this.wait(2000,function(){
				this.warn("LOGIN FAILED");
				this.capture('./output/LF_login_failed.png');
				logOut();//JUstin in case
			});
		}
		casper.evaluate(function(pass) {
	    	document.querySelector('#ctl00_cphLogin_keyboard').value = pass;
	    	document.querySelector('#ctl00_cphLogin_btnSubmit').click();
		},password);
		this.wait(2000,afterLoggedInStep);
	}
}

var afterLoggedInStep = function(){
	casper.log("After Logging Page","debug");	
    var messages = casper.evaluate(function() {
		return document.getElementById("ctl00_cphLogin_lblMessages").innerHTML;
	});
	if(messages == null || api.checkIfLoginFlowStepSucceeded(messages)){
		this.echo('Third Page: ' + this.getTitle());
		if(casper.getTitle().indexOf("Home") < 0){
			this.wait(2000,function(){
				this.warn("LOGIN FAILED");
				this.capture('./output/LF_login_failed.png');
				logOut();//JUstin in case
			});
		}
		casper.log("Logging successful","debug");	
		casper.capture('./output/3_pic_logged.png');
		
	}	
	 casper.wait(2000,goToAccountHistory());
}
var goToAccountHistory = function(){

	// casper.evaluate(function(histNavValue) {
	// 	console.log(histNavValue);
 //    	//document.querySelector("ctl00_ddlQuickNavigate").value = histNavValue;
 //    	//document.querySelector("ctl00_ddlQuickNavigate").selectedIndex = 3;
 //    	$('#ctl00_ddlQuickNavigate').val(histNavValue).change();
 //    	//console.log(document.querySelector("ctl00_ddlQuickNavigate"));
	// },NAV_LOCATIONS_FOR_QUICKNAV.AccountHistory);	

	console.log("Manuallly Clicking on link");
	casper.wait(2000,function(){
		casper.capture('./output/3.1_before click_to_account_history.png');
		var idVal = casper.evaluate(function() {
	    	console.log("Clicking now");
	    	//$("ctl00_btnQuickNavigate").click();
	    	var anchors = $('a.ctl00_MenuMain_1.ctl00_MenuMain_5');
			var linkToClick = $('a');
			anchors.each(function( index ) {
				var text =$(this).html() ;

				var searchStr = "Account History";
			  	if(text.indexOf(searchStr)>=0){
					console.log( $(this).html() );
					linkToClick = $(this);
				}
			});
			// linkToClick || linkToClick[0] || linkToClick[0].click();
			// linkToClick || linkToClick[0] || linkToClick[0].click();
			var idVal = linkToClick.attr('id');
			console.log(linkToClick);
			console.log("Manual Click Complete");
			return idVal;
		});
		casper.mouse.click("#"+idVal);
	});		
	casper.wait(2000,function(){
		casper.echo('Second Page: ' + this.getTitle());
		casper.capture('./output/4_account_history.png');
		logOut();
	});
}

var logOut = function(){
	casper.log('[TRACE] Logging out!', "info");
	casper.evaluate(function() {
    	document.querySelector('#ctl00_lnkBtnSignOff').click();
	});

	casper.wait(2000,function(){
		this.capture('./output/5_logged_out.png');
	});


	
    casper.wait(2000,function(){
    	casper.log('[TRACE] Exiting now!', "info");
    	casper.exit()
    });		
}

casper.then(initAndSubmitUsername);

casper.run();