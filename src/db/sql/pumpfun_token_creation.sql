-- Create the main table for pumpfun tokens
CREATE TABLE IF NOT EXISTS solana_pumpfun_tokens
(
    name String,
    symbol String,
    address String,
    metadata_uri String,
    creation_time DateTime CODEC (DoubleDelta, ZSTD)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(creation_time)
ORDER BY (creation_time, symbol);

-- Create materialized view for daily token creation counts
CREATE MATERIALIZED VIEW IF NOT EXISTS solana_pumpfun_tokens_daily
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(creation_time)
ORDER BY (creation_time)
AS
SELECT
    toStartOfDay(creation_time) as creation_time,
    countState() as total_tokens,
    uniqState(symbol) as unique_symbols
FROM solana_pumpfun_tokens
GROUP BY creation_time;

