let express = require('express')

const { Client } = require('tplink-smarthome-api');
var CronJob = require('cron').CronJob;
// var request = require('request');
const axios = require('axios');
const xml2js = require('xml2js');

let app = express()

var job = new CronJob(
    '*/1 * * * * *',
    function () {
        roku()
    },
    null,
    true,
    'America/New_York'
);
// Use this if the 4th param is default value(false)
// job.start()

function roku() {
    // http://192.168.86.238:8060/query/media-player
    const URL = 'http://192.168.86.238:8060/query/media-player';
    let state = ""
    axios
        .get(URL)
        .then(response => {
            // console.log(response.data)
            const parser = new xml2js.Parser();
            
            parser.parseString(response.data, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(result.player['$'].state)
                state = result.player['$'].state

                if (state === 'pause') {
                    let theatreWallLights = '192.168.86.77'
                    const client = new Client();
                    const plug = client.getDevice({ host: theatreWallLights }).then((device) => {
                        // device.getSysInfo().then(console.log);
                        // turns lights on
                        device.setPowerState(true);
                    });
                } else if (state === 'play') {
                    let theatreWallLights = '192.168.86.77'
                    const client = new Client();
                    const plug = client.getDevice({ host: theatreWallLights }).then((device) => {
                        // device.getSysInfo().then(console.log);
                        // turns lights off
                        device.setPowerState(false);
                    });
                }
                return
            }
            });
        })
        .catch(error => {
            console.log(error);
        });
}

// app.get('/roku', (req, res) => {
//     // http://192.168.86.238:8060/query/media-player

 
// })

// app.get('/', (req, res) => {

//     // 192.168.86.77
//     let theatreWallLights = '192.168.86.77'
//     const client = new Client();
//     const plug = client.getDevice({ host: theatreWallLights }).then((device) => {
//         // device.getSysInfo().then(console.log);
//         device.setPowerState(false);
//     });

// })



// DEFINING PORT AND LISTEN ON PORT
const PORT = process.env.PORT || 9990;

app.listen(PORT, () => {
    console.log("PORT:", PORT);
});