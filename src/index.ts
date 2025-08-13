import express, { Request, Response } from 'express';
import client from 'prom-client';
import { metricsMiddleware } from './middleware/metrics.middleware';

const app = express();

// Middleware to track metrics for incoming requests
app.use(metricsMiddleware);

app.get('/cpu', async (req, res) => {
  await new Promise(s => setInterval(s, 10000));
  res.json({
    msg: 'CPU load simulated',
  })
});

app.get("/user", (req, res) => {
    res.json({
        msg: "User endpoint",
    })
})

// Endpoint to expose Prometheus metrics
app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

app.listen(3000, () => {
  console.log('Server is running on 3000');
});