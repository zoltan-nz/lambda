const https = require('https');

const run = () => {
    https.get('.../prod/eratosthenes-1024?max=1000000&loops=1', (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    })
        .on('error', (e) => {
            console.error(e);
        });

};

for (let i = 0; i < 10; i++) {
    console.log(i);

    run();
}