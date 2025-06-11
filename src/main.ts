import { metaplexIndexer } from "./indexers/metaplex";
import { swapsIndexer } from "./indexers/swaps";
import { pumpfunIndexer } from "./indexers/pumpfun";
import { retry } from "./utils/retry";

async function main() {
    await Promise.all([
        retry(swapsIndexer),
        retry(metaplexIndexer),
        retry(pumpfunIndexer),
    ]);
}

void main()
