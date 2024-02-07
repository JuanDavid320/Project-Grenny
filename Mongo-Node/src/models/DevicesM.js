const mongoose = require('mongoose');

const devicesSchema = (collectionName) => {
  const devicesSchema = mongoose.Schema({
    idDevices: {
      type: Number,
      required: true,
    },
    idx: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    BatteryLevel: {
      type: String,
      required: true,
    },
    HardwareName: {
      type: String,
      required: true,
    },
    Data: {
      type: String,
      required: true,
    },
  });

  // Use the provided collectionName when creating the model
  return mongoose.model(collectionName, devicesSchema);
};

module.exports = devicesSchema;
