import { WaitForTransactionReceiptParameters } from 'viem'

export type CreateNewCollection = {
  writeContractResult: WaitForTransactionReceiptParameters
  resultValue: string
}
