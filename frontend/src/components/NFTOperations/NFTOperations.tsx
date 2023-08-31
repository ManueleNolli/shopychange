import React from 'react'
import { Center, Divider, Flex, HStack } from '@chakra-ui/react'

import { SaleStatus } from '../../types/components/SaleStatus'
import { NFTOperationsProps } from '../../types/props/NFTOperationsProps'

import CancelSaleManager from '../CancelSale/CancelSaleManager/CancelSaleManager'
import ModifySaleManager from '../ModifySale/ModifySaleManager/ModifySaleManager'
import BuyManager from '../Buy/BuyManager/BuyManager'

import SellOrIsForSale from '../Sell/SellOrIsForSale/SellOrIsForSale'
import { colors } from '../../styles/Colors'
import CollectionOwnerCheck from '../../utils/CollectionOwnerCheck/CollectionOwnerCheck'
import ShadowButton from '../ShadowButton/ShadowButton'
import WithdrawRoyaltyButton from '../WithdrawRoyaltyButton/WithdrawRoyaltyButton'

import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../context/userContext'

/*
Render different buttons for different roles:
    - Owner: Sell, Modify, Cancel
    - possible Buyer: Buy
    - other: nothing
*/

export default function NFTOperations({
  nft,
  sale,
  owner,
  onUpdate,
}: NFTOperationsProps) {
  const { userAddress } = useUserContext()
  const navigate = useNavigate()

  const renderOtherActions = () => {
    return (
      <Flex>
        <HStack spacing="2vw">
          <CollectionOwnerCheck
            collectionAddress={nft.contractAddress}
            redirectHome={false}
          >
            <ShadowButton
              label={'Modify Token Royalties'}
              bgColor={`${colors.primaryChakraColor}.400`}
              textColor={'white'}
              shadowColor={colors.primaryShadowColor}
              hoverColor={`${colors.primaryChakraColor}.500`}
              focusColor={`${colors.primaryChakraColor}.500`}
              onClick={() =>
                navigate(`/${nft.contractAddress}/${nft.tokenId}/royalties`)
              }
            />
          </CollectionOwnerCheck>
          <WithdrawRoyaltyButton
            collectionAddress={nft.contractAddress}
            tokenId={nft.tokenId}
          />
        </HStack>
      </Flex>
    )
  }

  if (owner === userAddress) {
    return (
      <Center flexDirection={'column'}>
        <Flex>
          <HStack spacing="2vw">
            <SellOrIsForSale nft={nft} onUpdate={onUpdate} sale={sale} />

            {sale?.status === SaleStatus.LISTED ? (
              <>
                <ModifySaleManager
                  nft={nft}
                  actualPrice={sale.price}
                  onUpdate={onUpdate}
                />
                <CancelSaleManager nft={nft} onUpdate={onUpdate} />
              </>
            ) : null}
          </HStack>
        </Flex>
        <Divider my="2vh" w="50vw" />
        {renderOtherActions()}
      </Center>
    )
  } else if (userAddress && sale?.status === SaleStatus.LISTED) {
    return (
      <Center flexDirection={'column'}>
        <BuyManager nft={nft} price={sale.price} onUpdate={onUpdate} />
        <Divider my="2vh" w="50vw" />
        {renderOtherActions()}
      </Center>
    )
  } else {
    return <Center>{renderOtherActions()}</Center>
  }
}
