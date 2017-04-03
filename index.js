const http = require('http');
const server = http.createServer();
server.listen(3000);
server.on('request', function(client_req, client_res) {
    console.log('======serve: ' + client_req.url);

    const options = {
        hostname: 'www.google.com',
        port: 80,
        path: client_req.url,
        method: 'GET'
    };
    const proxy = http.request(options, function (res) {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            //deal with url
            rawData = fixUrl(rawData);
            try {
                client_res.end(rawData);
            } catch (e) {
                console.log(e.message);
            }
        });
    });
    proxy.end();
});
function fixUrl(data) {
    const newData = data.replace(/(\/url\?q=)(\S*?)&\S*(\")/ig,'$2 $3');
    return newData;
}