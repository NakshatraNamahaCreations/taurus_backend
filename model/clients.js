const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
  
    clientName: {
      type: String,
      require: true,
    },
    clientphoneNumber:{
      type:String
    },
    email:{
      type:String
    },
    gstNo:{
      type:String
    },
    joiningdate:{
      type:String
    },
    address: {
      type: String,
    },
    // amount:{
    //  type:Number
    // },
    isActive: {
      type: Boolean,
      default: true
    },
   
  }, { timestamps: true, }
);

const Clientmodel = mongoose.model("client", ClientSchema);
module.exports = Clientmodel;
