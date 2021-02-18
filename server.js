var express = require("express");
const mongoose = require("mongoose");
const DataSet = require("./model/DataSet");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const url = "mongodb://localhost/testdb";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.post("/api/save", async (req, res) => {
  try {
    let dataSetObj = req.body.dataSetObj;
    for (let key in dataSetObj) {
      await DataSet.create({ data: dataSetObj[key], createdOn: new Date() });
    }
    return res.json({ data: "Data saved successfully..." });
  } catch (err) {
    console.log("err in  get data", err);
    return res.json({ data: "something went wrong try again later" });
  }
});

app.get("/api/getData", async (req, res) => {
  try {
    let dataSet = await DataSet.find({});
    res.json({ data: dataSet });
  } catch (err) {
    console.log("err in  get data", err);
    return res.json({ data: "something went wrong try again later" });
  }
});

app.post("/api/get-average", async (req, res) => {
  try {
    let ids = req.body.listOfId;
    let avgArr = [];
    //getting records
    const records = await DataSet.find({ _id: { $in: ids } });

    //seperate the dataset
    let recordsDataArr = [];
    for (let i = 0; i < records.length; i++) {
      recordsDataArr.push(records[i].data);
    }

    let primeArr = recordsDataArr[0];
    //adding array
    for (let i = 0; i < recordsDataArr.length - 1; i = i + 1) {
      primeArr = addArr(primeArr, recordsDataArr[i + 1]);
    }
    if (primeArr) {
      primeArr.forEach((element) => {
        avgArr.push(element / recordsDataArr.length);
      });
    }

    res.json({ data: avgArr });
  } catch (err) {
    res.json({ data: "something went wrong try again later" });
    console.log("err in get avg", err);
  }
});

function addArr(arr1, arr2) {
  let tempArr = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] != undefined && arr2[i] != undefined) {
      tempArr.push(arr1[i] + arr2[i]);
    }
  }
  return tempArr;
}
app.listen(5000, () => {
  console.log("server listen in 5000");
});
