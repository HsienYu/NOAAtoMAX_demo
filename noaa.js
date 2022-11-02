const path = require('path');
const Max = require('max-api');
const request = require('request');


let intervaltime = 50;

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
            url: 'https://services.swpc.noaa.gov/text/ace-magnetometer.txt?fbclid=IwAR3aWX7YS-YkqxZnjD30feFwpiKuzogPWJBdfDihRgT-XthAZIgzjc1fD6g',
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
            Max.outlet(sortedData[i]);
            console.log(sortedData[i]);
            await delay(intervaltime);
        }
    }
})();

