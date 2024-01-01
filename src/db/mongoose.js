const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/Yavanna-User-Api');
const uri = `mongodb+srv://kylestarrett1:${process.env.MONGOOSE_URI_PASS}@dummy-cluster.dbxumdd.mongodb.net/TavChat?retryWrites=true&w=majority`;
mongoose.connect(uri);
