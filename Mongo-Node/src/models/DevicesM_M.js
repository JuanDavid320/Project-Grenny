const mongoose = require('mongoose')

const devicesShemaM =mongoose.Schema({
   idDevices:{
    type: Number,
    require: false
   },
    Data1: [{
        type: String,
        require: false
    },
    {
        type: Number,
        require: false
    }
    ],
    Data2: [{
        type: String,
        require: false

    }, 
    {
        type: Number,
        require: false
    }],

    Data3: [{
        type: String,
        require: false

    },
    {
        type: Number,
        require: false

    }
    ],




    Data4: [{
        type: String,
        required: false
    },
    {
        type: Number,
        required: false
    }
    ],
    
});
module.exports =mongoose.model('devicesM',devicesShemaM);

