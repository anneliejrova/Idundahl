import express from 'express';
import dotenv from 'dotenv';
import { seriesRouter } from './routes/series.routes.js';
import { productRouter } from "./routes/product.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/series", seriesRouter);
app.use("/api/products", productRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpointen finns inte." });
});

app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
