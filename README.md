


<img src="./img/diagram.png" style="max-width: 600px" />

Repositiores
- [Solana data ingester](https://github.com/subsquid/squid-sdk/tree/master/solana/solana-ingest)
- [Solana hotblock service](https://github.com/subsquid/squid-sdk/tree/solana-data-service/solana/solana-data-service)
- [Portal](https://github.com/subsquid/sqd-portal)
- [Worker](https://github.com/subsquid/worker-rs)


## Fetching Solana swaps example

### Run

```bash
# Install dependencies
yarn install

# Run Clickhouse
docker compose up -d 

# Run swaps indexing
yarn ts-node src/main.ts
```

