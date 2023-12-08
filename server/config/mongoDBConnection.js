require("dotenv").config();
const mongoose = require("mongoose");

const MongoDbConnection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
        console.log(
            "Database connected: ",
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = MongoDbConnection;
