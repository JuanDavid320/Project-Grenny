const mongoose = require('mongoose')

const details_devicesShema = mongoose.Schema({


    idDevices: {
        type: Number,
        require: true

    },

    HardwareName: {
        type: String,
        require: true

    },

    DataConfig: [{
        type: String,
        require: true
    },
    {
        type: String,
        require: true
    }
    ],
    DataBattery: [{
        type: String,
        require: true

    }, 
    {
        type: String,
        require: true
    }],

    DataRSSI_LEVEL: [{
        type: String,
        require: true

    },
    {
        type: String,
        require: true

    }
    ],




    DataAlarm: [{
        type: String,
        required: false
    },
    {
        type: String,
        required: false
    }
    ],

    DataPerfil: [{
        type: String,
        required: false
    },
    {
        type: String,
        required: true
    }
    ],
    DataTime: [{
        type: String,
        required: false
    },
    {
        type: String,
        required: true
    }
    ]
   

    
   



});
module.exports = mongoose.model('details_devices', details_devicesShema);

