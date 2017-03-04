var net = require('net'),
    util = require('./core/core'),
    URL = require('url'),
    fs = require('fs'),
    service = require('../../service');

module.exports = function (req, socket) {
    var config = service.getConfig(),
        url = req.url,
        httpsOn = !!config.httpsOn,
        netClient;

    //http隧道
    if (!httpsOn) {
        if (url.search(/http|https/) === -1) {
            url = 'https://' + url;
        }

        var rewriteUrl = util.rewrite(url).rewriteUrl,
            parsedUrl = URL.parse(rewriteUrl),
            host = util.filter(parsedUrl.host).host,
            port = parsedUrl.port || 443;

        if (host) {
            netClient = net.createConnection({
                host: host,
                port: port
            });
        }
    } else {
        netClient = net.createConnection(config.httpsPort);
    }

    if (netClient) {
        netClient.on('connect', function () {
            socket.write("HTTP/1.1 200 Connection established\r\nProxy-agent: Netscape-Proxy/1.1\r\n\r\n");
        });

        socket
            .on('data', function (chunk) {
                netClient.write(chunk);
            })
            .on('end', function () {
                netClient.end();
            })
            .on('close', function () {
                netClient.end();
            })
            .on('error', function () {
                netClient.end();
            });

        netClient
            .on('data', function (chunk) {
                socket.write(chunk);
            })
            .on('end', function () {
                socket.end();
            })
            .on('close', function () {
                socket.end();
            })
            .on('error', function (err) {
                socket.end();
            });
    }
};