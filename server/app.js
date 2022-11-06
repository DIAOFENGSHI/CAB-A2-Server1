var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var axios = require("axios");
const AWS = require("aws-sdk");
var app = express();
const port = "8001";
const bucketName = "n10840044-traffic-aid";
const key_TopTen = "TopTen";
// S3 setup - IAM role
const s3Client = new AWS.S3({ apiVersion: "2006-03-01" });

const {
  createBucket,
  checkBucketExists,
  getS3Object,
  putS3Object,
} = require("./Classes/S3");
const { fetchQLDTrafficAPI } = require("./Classes/QLDTrafficAPI");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static("../client/build"));

app.get("/init", async (req, res) => {
  try {
    // checkt the bucket
    const bucket = await checkBucketExists(bucketName, s3Client);
    if (!bucket) {
      await createBucket(bucketName, s3Client);
    }
    const trafficInfo = await fetchQLDTrafficAPI(s3Client);
    // find the key - TopTen
    var toptenInfo = await getS3Object(bucketName, key_TopTen, s3Client);
    var topTen = {};
    // no, create a location object array, add the count propery for each location, set the property to zero, then split top ten
    if (!toptenInfo) {
      console.log("Generate Top Ten");
      toptenInfo = trafficInfo.info.map((location) => {
        return {
          name: location.description,
          id: location.id,
          count: 0,
        };
      });
      await putS3Object(bucketName, key_TopTen, toptenInfo, s3Client);
      topTen = { source: "New", data: toptenInfo.slice(0, 10) };
    }
    // yes, split to top ten
    else {
      topTen = { source: "S3", data: toptenInfo.slice(0, 10) };
    }
    // return the locations and topten
    res
      .status(200)
      .json({ source: "server1", apiInfo: trafficInfo, TopTen: topTen });
  } catch (err) {
    console.log(err);
    res.status(500).send("Status: Service Not Available");
  }
});

app.post("/traffic", async (req, res) => {
  var data = JSON.stringify(req.body);
  var config = {
    method: "post",
    url: "http://lb-traffic-aid-843688609.ap-southeast-2.elb.amazonaws.com:80/traffic",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      if (response.status == 200) {
        res.status(200).json({
          source: "server2",
          ...response.data,
        });
      } else {
        console.log(response.status);
        res.status(408).send("Status: Request Timeout");
      }
    })
    .catch(function (error) {
      res.status(404).send("Status: Not Found");
      console.log(error);
    });
});

app.listen(port, () => {
  console.log("Server listening on port: ", port);
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../432client/build", "index.html"));
});

module.exports = app;
