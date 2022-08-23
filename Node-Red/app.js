module.exports = function(RED) {
    
    function WhatsTheWeather(config) {
        RED.nodes.createNode(this, config);
        const request = require('request')
        var node = this;
        node.on('input', function(msg) {
            var city = String(msg.payload);
            var url = `http://api.weatherstack.com/current?access_key=9317da1936470c220dfb608cdb9e2269&query=${city}`           
            request({ url: url, json: true}, (error, response) => {
                const jsonData =  {location: response.body.location.name, localtime: response.body.location.localtime, temperature: response.body.current.temperature, status: response.body.current.weather_descriptions[0]}
                const object = JSON.stringify(jsonData);
                msg.payload = object;
                node.send(msg)
                //node.send('It is ' + response.body.current.weather_descriptions[0] + '\nTemperature in Wroclaw is at this moment : ' + response.body.current.temperature + ' C degrees');
            })
        });
    }
    RED.nodes.registerType("weather", WhatsTheWeather);
}

