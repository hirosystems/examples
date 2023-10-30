# Ordhook and BRC-20

Using Hiro's Ordhook, a Bitcoin Ordinals inscription indexer, to iterate on BRC-20 development.

## Setting up Ordhook

1. Download [ordhook](https://github.com/hirosystems/ordhook) and compile from source

```bash
git clone https://github.com/hirosystems/ordhook.git
cd ordhook
cargo ordhook-install
```

_For an alternative way_, follow the [Manual Installation](./docs/ordhook-installation.md).

## Using Ordhook to deliver payloads to an observer

Try out ordhook commands `scan` and `service` which allow for historical and ongoing observation, respectively. In terminal:

```bash
ordhook scan blocks 784726 784727 --mainnet
```

This commands returns these results (which happen to be the first two inscriptions ever made):

```bash
Inscription 6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0 revealed at block #767430 (ordinal_number 1252201400444387, inscription_number 0)
Inscription 26482871f33f1051f450f2da9af275794c0b5f1c61ebf35e4467fb42c2813403i0 revealed at block #767753 (ordinal_number 727624168684699, inscription_number 1)
```

To get started running the API, run the following commands:

```bash
yarn workspace brc20-api install && yarn workspace brc20-api start
```

3. You can now deliver ordhook `scan` and `service` payloads to the port exposed by our local web server, `http://localhost:3000/api/events`

Here we will scan historical blocks and post inscription data to the URL specified (here, a local web server):

```bash
ordhook scan blocks 784726 784727 --post-to=http://localhost:3000/api/events --config-path=./Ordhook.toml
```

Additionally, ordhook supports ongoing observation of the bitcoin chain for inscription data and can deliver post requests to a specified url.

```bash
ordhook service start --post-to=http://localhost:3000/api/events --config-path=./Ordhook.toml
```

## Create a custom view of BRC-20 inscriptions with JS

You can extract custom, finely tailored views of ordinals inscription data by working with ordhook payloads. If you look at the [`src/server.ts`](./src/server.ts) script, you can see how the inscription data is delivered and how to parse it.

Here we are simply displaying the results in the browser, but you could just as easily populate a database, or trigger another service.

```typescript
// Handle POST requests to /api/events
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

  res.status(200).send({ message: "SNS added" });
});
```

### Misc

If you want to learn more about Hiro's Ordinals tooling:

- Join the [Stacks Discord server](https://discord.com/invite/pPwMzMx9k8)
- Follow, @, or DM us on Twitter at [@hirosystems](https://twitter.com/hirosystems)
