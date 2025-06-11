CREATE TABLE IF NOT EXISTS solana_metaplex_tokens
(
    timestamp           DateTime CODEC (DoubleDelta, ZSTD),
    account             String,
    name                String,
    symbol              String,
    mint                String,
    uri                 String,
    transaction_hash    String,
    block_number        UInt32,
    is_mutable Bool
) ENGINE = ReplacingMergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (account);

-- Create materialized view for daily Metaplex token creation statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS solana_metaplex_daily
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp)
AS
SELECT
    toStartOfDay(timestamp) as timestamp,
    countState() as total_tokens,
    uniqState(symbol) as unique_symbols,
    uniqState(mint) as unique_mints,
    uniqState(account) as unique_accounts
FROM solana_metaplex_tokens
GROUP BY timestamp;
