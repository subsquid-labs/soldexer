CREATE TABLE IF NOT EXISTS solana_swaps_raw
(
    timestamp                    DateTime CODEC (DoubleDelta, ZSTD),
    dex                          LowCardinality(String),
    token_a                      String,
    token_b                      String,
    amount_a                     Float64,
    amount_b                     Float64,
    account                      String,
    block_number                 UInt32 CODEC (DoubleDelta, ZSTD),
    transaction_index            UInt16,
    instruction_address          Array (UInt16),
    transaction_hash             String,
    slippage                     Float64,
    pool_token_a_reserve         Float64,
    pool_token_b_reserve         Float64,
    sign                         Int8,
    pool_address                 String,

    -- Secondary indexes
    INDEX idx_account_timestamp (timestamp, account) TYPE minmax GRANULARITY 1,
    INDEX idx_account (account) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX pool_idx pool_address TYPE bloom_filter GRANULARITY 1,
    INDEX amount_a_idx amount_a TYPE minmax GRANULARITY 4
) ENGINE = CollapsingMergeTree(sign)
      PARTITION BY toYYYYMM(timestamp) -- DATA WILL BE SPLIT BY MONTH
      ORDER BY (block_number, transaction_index, instruction_address);

