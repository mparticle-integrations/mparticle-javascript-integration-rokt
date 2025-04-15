var express = require('express');
var path = require('path');
var app = express();
var PORT = 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the parent dist directory to access the Rokt Kit
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// Route for the home page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, function () {
    console.log(
        [
            '',
            '    -----------------------------------------',
            '    Rokt Kit Example App Server',
            '    -----------------------------------------',
            '    Server running at http://localhost:' + PORT,
            '',
            '    Press Ctrl+C to stop the server',
            '    -----------------------------------------',
            '',
        ].join('\n')
    );
});
