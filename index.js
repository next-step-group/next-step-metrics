const fs = require('fs')

// Handles Next.js backend metrics calls
exports.metrics = (req, res) => {
  const json = JSON.parse(req.body);
  const { name , value } = json;
  const filePath = "next-step-metrics.json";

  // Generate a metrics.json file in your project's root folder to house web vitals data
  if (!fs.existsSync(filePath)) {
    const newObj = { metrics: {}, logs: [] };
    fs.writeFileSync(filePath, JSON.stringify(newObj, null, 4));
  }

  // Format and add data to the metrics.json file
  const results = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (name === "TTFB") {
    results.metrics.date = new Date();
    results.logs.push(results.metrics);
  }
  
  results.metrics[name] = value;

  fs.writeFileSync(filePath, JSON.stringify(results, null, 4));

  res.status(200).json({ test: "test worked" });
};

// Sends Metrics data to /NextStepMetrics on page load
exports.reportWebVitals = async (metric) => {
  const body = JSON.stringify(metric);
  const url = "/api/next-step";

  await fetch(url, { body, method: "POST", keepalive: true });
}

