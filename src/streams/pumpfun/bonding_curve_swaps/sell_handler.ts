import * as pumpfun from '../../../abi/pumpfun'
import type { TradeEvent } from '../../../abi/pumpfun/types'
import { type Block, type Instruction, getInstructionLogs } from '../../../utils'
import type { PumpfunSwapTransaction } from './index'
import { getVirtualTokenPrice } from './utils'

export function handlePumpfunSell(ins: Instruction, block: Block): PumpfunSwapTransaction | null {
  const {
    accounts: { mint },
  } = pumpfun.instructions.sell.decode(ins)
  const sellEvent = getSellEvent(ins, block)

  if (!sellEvent) {
    return null
  }

  const { user, solAmount, tokenAmount, virtualSolReserves, virtualTokenReserves } = sellEvent

  return {
    account: user,
    type: 'sell',
    baseToken: {
      amount: tokenAmount,
      token: { postMint: mint, postDecimals: 6 },
    },
    quoteToken: {
      amount: solAmount,
      token: {
        postMint: 'So11111111111111111111111111111111111111112',
        postDecimals: 9,
      },
    },
    tokenPrice: getVirtualTokenPrice(virtualSolReserves, virtualTokenReserves),
  }
}

function getSellEvent(ins: Instruction, block: Block): TradeEvent | null {
  const [sellEventLog] = getInstructionLogs(ins, block).filter((l) => l.message !== 'Instruction: Sell')
  if (!sellEventLog) {
    return null
  }

  const hex = Buffer.from(sellEventLog.message, 'base64').toString('hex')
  const sellEvent = pumpfun.events.TradeEvent.decode({ msg: `0x${hex}` })
  return sellEvent
}
