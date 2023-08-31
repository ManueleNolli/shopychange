import { WaitForTransactionReceiptParameters } from 'viem'

export type MintResult = {
  writeContractResult: WaitForTransactionReceiptParameters
  resultValue: number
}
