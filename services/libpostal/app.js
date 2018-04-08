const node_postal = require('node-postal');
const express = require('express');
const app = express();

app.get('/parse', (req, res) => {
    var search = req.query.address;
    var result = node_postal.parser.parse_address(search);
    res.send(result);

});
app.get('/expand', (req, res) => {
    var search = req.query.address;
    var result = node_postal.parser.expand_address(search);
    res.send(result);

});

app.listen(8080, () => console.log('libpostal  listening on port 3000!'));