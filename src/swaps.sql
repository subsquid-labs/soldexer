CREATE TABLE IF NOT EXISTS solana_swaps_raw
(
    timestamp           DateTime CODEC (DoubleDelta, ZSTD),
    dex                 LowCardinality(String),
    pool_address        String,
    token_a             String,
    token_b             String,
    amount_a            Float64,
    amount_b            Float64,
    account             String,
    block_number        UInt32 CODEC (DoubleDelta, ZSTD),
    transaction_index   UInt16,
    instruction_address Array(UInt16),
    transaction_hash    String,
    sign                Int8
) ENGINE = CollapsingMergeTree(sign)
      PARTITION BY toYYYYMM(timestamp) -- DATA WILL BE SPLIT BY MONTH
      ORDER BY (block_number, transaction_index, instruction_address);