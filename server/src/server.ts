import dotenv from "dotenv";
dotenv.config();

import app from "./app/app";


const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});