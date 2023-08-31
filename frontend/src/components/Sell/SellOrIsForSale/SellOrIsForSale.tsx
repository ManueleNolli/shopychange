import React from 'react'
import { NFT } from '../../../types/components/NFT'
import { Sale } from '../../../types/components/Sale'
import { SaleStatus } from '../../../types/components/SaleStatus'
import { colors } from '../../../styles/Colors'
import ShadowButton from '../../ShadowButton/ShadowButton'
import SellManager from '../SellManager/SellManager'

type SellOrIsForSaleProps = {
  nft: NFT
  onUpdate: () => void
  sale: Sale | null
}

export default function SellOrIsForSale({
  nft,
  onUpdate,
  sale,
}: SellOrIsForSaleProps) {
  if (sale?.status !== SaleStatus.LISTED) {
    return <SellManager nft={nft} onUpdate={onUpdate} />
  } else {
    return (
      <ShadowButton
        isDisabled={true}
        label={'For Sale'}
        bgColor={`${colors.forSaleChakraColor}.400`}
        textColor={'white'}
        shadowColor={colors.forSaleShadowColor}
        hoverColor={`${colors.forSaleChakraColor}.500`}
        focusColor={`${colors.forSaleChakraColor}.500`}
      />
    )
  }
}
