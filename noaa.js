const path = require('path');
const Max = require('max-api');
const request = require('request');


let intervaltime = 50;
let data_ace_swepam = 'https://services.swpc.noaa.gov/text/ace-swepam.txt?fbclid=IwAR1YJzzfRPuoWMYhzcWo3abbL00-29cO8fQVyiWZj5jeC7pN9zkZdikWiXk';
let data_ace_magnetometer = 'https://services.swpc.noaa.gov/text/ace-magnetometer.txt?fbclid=IwAR2SrkJFtKifnS4GhROizUKIQiM9IG0ayAWVOIyrMdSJMRERqTjQ2Si1hcc'


const promisifiedRequest = function (options) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (response) {
                return resolve(response);
            }
            if (error) {
                return reject(error);
            }
        });
    });
};

const delay = (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
};

Max.addHandler("echo", (msg) => {
    intervaltime = msg;
});


(async function () {
    while (true) {

        const options = {
            url: data_ace_swepam,
            method: 'GET',
            gzip: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36'
            }
        };
        let response = await promisifiedRequest(options);
        // console.log(response.headers);
        let data = response.body
        // console.log(response.body);
        let dataArray = data.split('\n');
        let sortedData = dataArray.splice(20, dataArray.length - 2);
        // console.log(sortedData);
        for (let i = 0; i < sortedData.length; i++) {
            Max.outlet(`data_ace_swepam: ${sortedData[i]}`);
            console.log(`data_ace_swepam: ${sortedData[i]}`);
            await delay(intervaltime);
        }
    }
})();

(async function () {
    while (true) {

        const options = {
            url: data_ace_magnetometer,
            method: 'GET',
            gzip: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36'
            }
        };
        let response = await promisifiedRequest(options);
        // console.log(response.headers);
        let data = response.body
        // console.log(response.body);
        let dataArray = data.split('\n');
        let sortedData = dataArray.splice(20, dataArray.length - 2);
        // console.log(sortedData);
        for (let i = 0; i < sortedData.length; i++) {
            Max.outlet(`data_ace_magnetometer: ${sortedData[i]}`);
            console.log(`data_ace_magnetometer: ${sortedData[i]}`);
            await delay(intervaltime);
        }
    }
})();

