CREATE TABLE IF NOT EXISTS solana_pumpfun_bonding_curve_swaps (
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    event_type Enum8('buy' = 1, 'sell' = 2),
    base_token String,
    base_token_decimals UInt8,
    quote_token String,
    quote_token_decimals UInt8,
    user String,
    block_number UInt32 CODEC (DoubleDelta, ZSTD),
    block_hash String,
    transaction_index Int64,
    transaction_hash String,
    raw_token_price UInt128,
    -- We used 10^18 as the scaling factor for the token price to preserve precision.
    -- We also adjust the value to the token decimal precision.
    token_price Float64 MATERIALIZED (raw_token_price / pow(10, 18) / pow(10, quote_token_decimals - base_token_decimals)),
    sign Int8
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, block_number, transaction_index);

CREATE MATERIALIZED VIEW IF NOT EXISTS solana_pumpfun_token_candles
ENGINE AggregatingMergeTree()
ORDER BY (timestamp, base_token, quote_token)
AS
SELECT toStartOfSecond(toDateTime64(timestamp, 3)) AS timestamp,
    base_token,
    quote_token,
    countState() as total_swaps,
    uniqState(user) as unique_users,
    argMinState(token_price, ps.timestamp) AS open,
    maxState(token_price) AS high,
    minState(token_price) AS low,
    argMaxState(token_price, ps.timestamp) AS close
FROM solana_pumpfun_bonding_curve_swaps ps
GROUP BY timestamp, base_token, quote_token;