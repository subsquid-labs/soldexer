# Soldexer
<img src="./img/logo.svg" width="500" alt="Soldexer Logo" />

Soldexer is a high-throughput data service for accessing Solana's historical and real-time data. It processes 10MB+ per request with ~2-3 second latency, making it significantly faster than running your own node.

## Table of Contents

- [What is Soldexer](#what-is-soldexer)
- [Why Soldexer?](#why-soldexer)
- [Development Status](#development-status)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
  - [Running the Project](#running-the-project)
- [How It Works](#how-it-works)
- [Related Repositories](#related-repositories)

# Why Soldexer?

Unlike running your own decicated node (~$2k+/mo) or paying for proprietary APIs, Soldexer gives you scalable access, full filtering, and built-in transformations—at a fraction of the effort and cost.

# Development Status

Soldexer is under active development. Open Beta is coming soon.

# Getting Started

## Prerequisites
- Yarn package manager
- Docker (if using local ClickHouse)

## Installation

Install the project dependencies:

```bash
yarn install
```

## Configuration

The project uses a `soldexer.json` configuration file. Here's what each field means:

### Required Configuration

- **`portalUrl`** (string): The URL of the Soldexer portal
- **`pipes`** (object): Configuration for each data pipeline

### Optional Configuration

- **`clickhouse`** (object): ClickHouse database configuration (uses defaults if not provided)

### Example Configuration

```json
{
    "portalUrl": "https://portal.sqd.dev",
    "clickhouse": {
        "url": "http://localhost:8123",
        "database": "soldexer",
        "username": "default",
        "password": ""
    },
    "pipes": {
        "swaps": {
            "fromBlock": 332557468
        },
        "metaplex": {
            "fromBlock": 332557468
        },
        "pumpfun": {
            "fromBlock": 332557468
        }
    }
}
```

### Pipes Configuration

Each pipe requires:
- **`fromBlock`** (number): Starting block number for indexing
- **`toBlock`** (number, optional): Ending block number (if not provided, runs indefinitely)

Available pipes: `swaps`, `metaplex`, `pumpfun`

### ClickHouse Configuration

If not provided, the following defaults are used:
- **`url`**: `http://localhost:8123`
- **`database`**: `default`
- **`username`**: `default`
- **`password`**: `""` (empty string)

## Database Setup

You have two options for the database:

### Option 1: Local ClickHouse (Recommended for Development)

Start ClickHouse using Docker Compose:

```bash
docker compose up -d
```

This will start a local ClickHouse instance accessible at `http://localhost:8123`.

### Option 2: External ClickHouse Database

If you have your own ClickHouse instance, update the `clickhouse` section in `soldexer.json`:

```json
{
    "clickhouse": {
        "url": "https://your-clickhouse-url:8123",
        "database": "your_database_name",
        "username": "your_username",
        "password": "your_password"
    }
}
```

## Running the Project

Once you have installed dependencies, configured `soldexer.json`, and set up your database, start the indexer:

```bash
yarn start
```

The indexer will:
1. Read your configuration from `soldexer.json`
2. Connect to the specified ClickHouse database
3. Start all configured pipes simultaneously
4. Begin indexing Solana data from the specified starting blocks

# How It Works

<img src="./img/diagram.png" width="600" alt="Soldexer Data Flow" />

1. **Client** sends a query to the Portal.
2. **Portal**:
   - Pulls recent data from local hotblocks storage.
   - Splits and routes historical data queries to decentralized workers.
3. **Hotblocks Data Service** streams live Solana data from RPCs into the Portal.
4. **Workers** fetch and return compressed historical data stored in S3.

# Related Repositories

| Name | Description |
|------|-------------|
| [solana-ingest](https://github.com/subsquid/squid-sdk/tree/master/solana/solana-ingest) | Extracts Solana data and uploads compressed chunks to S3. |
| [solana-data-service](https://github.com/subsquid/squid-sdk/tree/solana-data-service/solana/solana-data-service) | Streams live Solana blocks to Portals via RPC. |
| [sqd-portal](https://github.com/subsquid/sqd-portal) | Handles incoming queries and routes to workers or hotblocks. |
| [worker-rs](https://github.com/subsquid/worker-rs) | Decentralized worker that queries and serves data chunks from S3. |

# Example: Solana Swaps

```bash
# Install dependencies
yarn install

# Start ClickHouse
docker compose up -d

# Start the swaps indexer
yarn ts-node src/main.ts
