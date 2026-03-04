import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { seedDB } from "./src/seed/seed.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  await seedDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
