const ngrok = require("ngrok");
const fs = require('fs');

if (!process.env.TARGET_HOST || !process.env.TARGET_PORT) {
  throw new Error(
    "The following env variables are required: TARGET_HOST, TARGET_PORT"
  );
  process.exit(1);
}

const targetAddress = `${process.env.TARGET_HOST}:${process.env.TARGET_PORT}`;

const validRegions = ["us", "eu", "au", "ap"];
const region = process.env.NGROK_REGION
  ? validRegions.includes(process.env.NGROK_REGION.toLowerCase())
    ? process.env.NGROK_REGION.toLowerCase()
    : "us"
  : "us";

const validProtos = ["http", "tcp"];
const proto = process.env.NGROK_PROTO
  ? validProtos.includes(process.env.NGROK_PROTO.toLowerCase())
    ? process.env.NGROK_PROTO.toLowerCase()
    : "http"
  : "http";

const options = {
  proto: proto,
  addr: targetAddress,
  auth: process.env.NGROK_AUTH,
  region: region,
  authtoken: process.env.NGROK_TOKEN,
  configPath: "/ngrok.yml"
};

console.log('')
console.log(options);
console.log('')

ngrok
  .connect()
  .then(url => {
    console.log(`The ngrok tunnel is active`);
    console.log(`${url} ---> ${targetAddress}`);

    fs.writeFile("/tmp/bkp/ngrok.txt", url, function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log("The file was saved!");
    });

  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
