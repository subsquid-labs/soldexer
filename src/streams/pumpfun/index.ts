import { PortalAbstractStream } from '@sqd-pipes/core';
import { getInstructionDescriptor } from '@subsquid/solana-stream';
import * as pumpfun from '../../abi/pumpfun';

export interface PumpfunTokenCreation {
  name: string;
  symbol: string;
  uri: string;
  deployTime: Date;
  address: string;
}

export class SolanaPumpfunTokensStream extends PortalAbstractStream<PumpfunTokenCreation> {
  async stream(): Promise<ReadableStream<PumpfunTokenCreation[]>> {
    const source = await this.getStream({
      type: 'solana',
      fields: {
        block: {
          number: true,
          hash: true,
          timestamp: true,
        },
        transaction: {
          transactionIndex: true,
          signatures: true,
        },
        instruction: {
          transactionIndex: true,
          data: true,
          instructionAddress: true,
          programId: true,
          accounts: true,
        },
      },
      instructions: [
        {
          programId: [pumpfun.programId],
          d8: [pumpfun.instructions.create.d8],
          isCommitted: true,
          transaction: true,
        },
      ],
    });

    return source.pipeThrough(
      new TransformStream({
        transform: ({ blocks }, controller) => {
          const res = blocks.flatMap((block: any) => {
            if (!block.instructions) return [];

            const tokens: PumpfunTokenCreation[] = [];

            for (const ins of block.instructions) {
              if (
                ins.programId !== pumpfun.programId ||
                getInstructionDescriptor(ins) !== pumpfun.instructions.create.d8
              ) {
                continue;
              }

              const token = pumpfun.instructions.create.decode(ins);

              if (!token.data.name || !token.data.symbol) {
                continue;
              }

              tokens.push({
                ...token.data,
                address: token.accounts.mint,
                deployTime: new Date(block.header.timestamp * 1000),
              });
            }

            return tokens;
          });

          controller.enqueue(res);
        },
      }),
    );
  }
}

