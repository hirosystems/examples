import express, { Express, Request, Response } from "express";

// Create a new express application
const app: Express = express();

// The port the express app will listen on
const PORT: number = 3000;

// Use the body-parser middleware to parse incoming request bodies.
// We set a limit of 5mb to handle large payloads that may come with the POST requests.
// This is necessary to prevent potential issues with payload size exceeding the default limit.
app.use(
  express.json({ limit: "5mb" }),
  express.urlencoded({ limit: "5mb", extended: true })
);

function hexToUtf8(hex: string) {
  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return decodeURIComponent(encodeURIComponent(str));
}

function renderHTML(events: any[]): string {
  let html = "<ul>";
  events.forEach((event) => {
    html += `<li>${JSON.stringify(event)}</li>`;
  });
  html += "</ul>";
  return html;
}

let events: any = [];

// All routes for the Express app
app.post("/api/events", async (req: Request, res: Response) => {
  const { apply } = req.body;

  apply.forEach((item: any) => {
    item.transactions.forEach((transaction: any) => {
      if (transaction.metadata && transaction.metadata.ordinal_operations) {
        transaction.metadata.ordinal_operations.forEach((operation: any) => {
          // Filter to only collect revealed inscripions
          if (operation.inscription_revealed) {
            let op_data = operation.inscription_revealed;
            if (op_data.content_type === "text/plain;charset=utf-8") {
              const decodedContent = hexToUtf8(op_data.content_bytes);
              try {
                let content = JSON.parse(decodedContent); // Parse the decoded inscription content into JSON format
                // Only collect BRC-20 inscriptions
                if (content["p"] === "brc-20") {
                  events.push(content);
                }
              } catch (e: any) {
                if (!(e instanceof SyntaxError)) {
                  console.log(`Error parsing JSON: ${e.message}`);
                }
              }
            }
          }
        });
      }
    });
  });

  res.status(200).send({ message: "BRC-20 added" });
});

app.get("/events", (req, res) => {
  if (req.headers.accept === "application/json") {
    res.json({ events });
  } else if (req.headers.accept === "text/html") {
    res.send(renderHTML(events)); // convert data to HTML
  } else {
    // Default to JSON if no Accept header is specified
    res.json({ events });
  }
});

// Start server on port 3000
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
