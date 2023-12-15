# Example Server for parsing Chainhook `payload` data

```typescript
const express = require("express");
const app = express();
app.use(express.json());

app.post("/api/events", async (req, res) => {
  const events = req.body;
  // Loop through each item in the apply array
  events.apply.forEach((item: any) => {
    // Loop through each transaction in the item
    item.transactions.forEach((transaction: any) => {
      // If the transaction has operations, loop through them
      if (transaction.operations) {
        transaction.operations.forEach((operation: any) => {
          // Log the operation
          console.log({ operation });
        });
      }
    });
  });

  // Send a response back to Chainhook to acknowledge receipt of the event
  res.status(200).send({ message: "Event triggered!" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```
