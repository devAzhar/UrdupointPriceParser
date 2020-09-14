const Hapi = require('@hapi/hapi');
const fetch = require("node-fetch");
const HtmlTableToJson = require('html-table-to-json');

const $PORT = 3000;
const $HOST = "localhost";

const init = async () => {

    const server = Hapi.server({
        port: $PORT,
        host: $HOST
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
    
            return 'Hello World!';
        }
    });

    server.route({
        method: 'GET',
        path: '/parse/{city}',
        handler: async function (request, h) {
            var city = request.params.city.toLowerCase();
            var url = `https://www.urdupoint.com/daily-prices/vegetable-prices-in-${city}-city.html`
            
            fetch(url)
            .then(response => response.text())
            .then(content => {
              var find = "<table";
              var startIndex = content.indexOf(find);
              var tableData = content.substring(startIndex);
              
              find = "</table>"
              var endIndex = tableData.indexOf(find);
              tableData = tableData.substring(0, endIndex+find.length);
              //console.log(tableData);
              var data = HtmlTableToJson.parse(tableData);
              console.log(data.results);
            });
                    
            return 'Parsing: ' + url;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);

};


process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
