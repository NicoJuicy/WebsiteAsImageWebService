/**
 * Simple service for fetching screenshots
 */
var express = require('express');
var app = express();

// define the public directory for static assets
var public_dir = __dirname + '/public';

//setup
app.use(express.static(public_dir));

//fetch url
app.get('/thumb/:url', function (req, res) {

    // get url to process
    var url_to_process = req.params.url;
  
    if (url_to_process === undefined || url_to_process == '') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("404 Not Found");
    }
    
    // phantomjs screenshot
    var phantom = require('phantom');


    //TODO: for performance improvements https://github.com/blockai/phantom-pool 
    phantom.create().then(function (ph) {
        ph.createPage().then(function (page) {
            page.open(req.params.url).then(function (status) {
                var image_file_name = url_to_process.replace(/\W/g, '_') + ".png";
                var image_path = public_dir + "/" + image_file_name;

                page.render(image_path).then(function () {
                    res.sendfile(image_path);
                    page.close();
                    ph.exit();
                });
            });
        });
    });

});

// start server
var server = app.listen(8080, function () {
    console.log('Listening on port %d', server.address().port);
});