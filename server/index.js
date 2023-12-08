const app = require("./app");
const mongoDbConnection = require("./config/mongoDBConnection");

const port = process.env.PORT || 5000;
mongoDbConnection()
    .then(() => {

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });