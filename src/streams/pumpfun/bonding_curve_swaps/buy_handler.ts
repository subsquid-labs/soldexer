import * as pumpfun from '../../../abi/pumpfun'
import type { TradeEvent } from '../../../abi/pumpfun/types'
import { type Block, type Instruction, getInstructionLogs } from '../../../utils'
import type { PumpfunSwapTransaction } from './index'
import { getVirtualTokenPrice } from './utils'

export function handlePumpfunBuy(ins: Instruction, block: Block): PumpfunSwapTransaction | null {
  const {
    accounts: { mint },
  } = pumpfun.instructions.buy.decode(ins)
  const buyEvent = getBuyEvent(ins, block)

  if (!buyEvent) return null

  const { user, solAmount, tokenAmount, virtualSolReserves, virtualTokenReserves } = buyEvent

  return {
    account: user,
    type: 'buy',
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

function getBuyEvent(ins: Instruction, block: Block): TradeEvent | null {
  const [buyEventLog] = getInstructionLogs(ins, block).filter(
    (l) => l.message !== 'Instruction: Buy' && l.message.startsWith('vdt/'),
  )
  if (!buyEventLog) {
    return null
  }

  const hex = Buffer.from(buyEventLog.message, 'base64').toString('hex')
  const buyEvent = pumpfun.events.TradeEvent.decode({ msg: `0x${hex}` })
  return buyEvent
}
