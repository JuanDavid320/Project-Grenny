const mongoose = require('mongoose')

const dates_devicesShema =mongoose.Schema({


    idDevices:{
        type: Number,
        require:true

    },

    HardwareName: {
        type: String,
        require: true

    },


    Data:{
        type:Number,
        require:true
    },

    DataT:{
        type:Number,
        require:true
    },

    Date:{
        type:String,
        require:true
    }
});
module.exports =mongoose.model('dates_devices',dates_devicesShema);

