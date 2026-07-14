const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()

const PORT = process.env.PORT || 500

const startServer = async () => {
   try {
    console.log("🛰️ Scanning database grid...")
     console.log("Mongo URI exists:", !!process.env.MONGO_URI);
    console.log(
      "Mongo URI preview:",
      process.env.MONGO_URI?.substring(0, 30)
    );

    await mongoose.connect(process.env.MONGO_URI)

    console.log("🐅 Tiger 3: Connection established in sector A");
    console.log("🐅 Tiger 2: Structural integrity stable");
    console.log("📡 Radar status: CLEAR");
    console.log("⚔️ Entering attack formation... backend online");
    
    app.listen(PORT, () => {
        console.log(`🚀 Command center active on port ${PORT}`)
    })
    console.log("RESEND KEY:", process.env.RESEND_API_KEY);
   }

   catch (err) {
    console.log("❌ Mission failed. System breach detected:", err)
   }
}


startServer()