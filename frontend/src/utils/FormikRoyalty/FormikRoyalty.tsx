{
  /* eslint-disable */
}
import { Royalty } from '../../types/components/Royalty'

export const checkIfRoyaltyReceiverIsInvalid = (form: any, index: number) => {
  // it must check if the royalties array exist first
  // then check if the index of the array exist
  // then check if the receiver field exist
  // return true if it exist else return false

  return (
    form.errors.royalties &&
    form.errors.royalties[index] &&
    form.errors.royalties[index].receiver &&
    form.touched.royalties &&
    form.touched.royalties[index] &&
    form.touched.royalties[index].receiver
  )
}

export const errorMessageRoyaltyReceiver = (form: any, index: number) => {
  if (checkIfRoyaltyReceiverIsInvalid(form, index)) {
    return form.errors.royalties[index].receiver
  }
}

export const checkIfRoyaltyValuesIsInvalid = (form: any) => {
  const royalties = form.values.royalties
  let royaltiesValuesSum = 0
  royalties.forEach((royalty: Royalty, index: number) => {
    royaltiesValuesSum += Number(royalty.share)
  })

  if (royaltiesValuesSum > 100) {
    return true
  }
  return false
}

export const checkIfLastRoyalty = (form: any, index: number) => {
  const royalties = form.values.royalties
  if (royalties.length - 1 === index) {
    return true
  }
  return false
}
