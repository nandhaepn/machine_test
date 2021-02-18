const mongoose = require("mongoose");
const schema = mongoose.Schema;

const metadataSchema = new schema(
  {
    data: {
      type: Array,
    },
    createdOn: {
      type: Date,
    },
  },
  { timestamp: true }
);

const dataSet = mongoose.model("dataSet", metadataSchema);

module.exports = dataSet;
