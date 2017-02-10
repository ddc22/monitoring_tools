var page = require('webpage').create();


page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');

page.open("https://www.commercialbk.com/online/2/2/22001.aspx", function (status) {
    page.evaluate(function (username) {

        console.log('Filling username and submitting');
        document.querySelector('#ctl00_cphLogin_txtLoginID').value = username; 
        document.querySelector('#ctl00_cphLogin_btnSubmit').click();
    }, username);

     setTimeout(function(){
            page.evaluate(function (password) {
                console.log('Filling password and submitting');
                document.querySelector('#ctl00_cphLogin_keyboard').value = password;
                document.querySelector('#ctl00_cphLogin_btnSubmit').click();
            }, password);
        }, 2000);
    console.log('Complete ' );
    //slimer.exit()
});