'use strict';
const fs = require('fs');

// Handles Next.js backend metrics calls
const importMetrics = (req, res) => {
  const json = JSON.parse(req.body);
  const { name , value } = json;

  // Generate a metrics.json file in your project's root folder to house web vitals data
  if (!fs.existsSync("NextStepMetrics.json")) {
    const newObj = { metrics: {}, logs: [], id : 0};
    fs.writeFileSync("NextStepMetrics.json", JSON.stringify(newObj, null, 4));
  }

  // Format and add data to the metrics.json file
  const results = JSON.parse(fs.readFileSync("NextStepMetrics.json", "utf-8"));

  if (results.metrics.FCP) {
    if (name === "Next.js-hydration") {
      results.metrics.id = results.id;
      results.logs.push(results.metrics);
      results.metrics = {};
      results.id++;
    }
  }

  results.metrics[name] = value;
  results.metrics.date = new Date();

  fs.writeFileSync("NextStepMetrics.json", JSON.stringify(results, null, 4));

  res.status(200).json({ test: "test worked" });
};

// Sends Metrics data to /NextStepMetrics on page load
async function reportWebVitals(metric) {
  const body = JSON.stringify(metric);
  const url = "/api/NextStepMetrics";
  await fetch(url, { body, method: "POST", keepalive: true });
}


module.exports = (importMetrics, reportWebVitals)