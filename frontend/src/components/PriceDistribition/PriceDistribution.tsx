import React from 'react'
import {
  Heading,
  Box,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Text,
} from '@chakra-ui/react'
import { PriceDistributionProps } from '../../types/components/PriceDistribution'
import { renderAddress } from '../../utils/SimplifiedAddress/SimplifiedAddress'
import usePriceDistrubution from './usePriceDistribution'
import QueryContainer from '../../utils/QueryContainer/QueryContainer'

export default function PriceDistrubution({
  address,
  tokenId,
  price,
  isOwner,
}: PriceDistributionProps) {
  const {
    settedPrice,
    remainingValue,
    otherRoyalties,
    otherRoyaltiesSum,
    marketplaceRoyalty,
    fixedNumber,
    isFetching,
    isError,
  } = usePriceDistrubution({ address, tokenId, price, isOwner })

  return (
    <Box pl="1vw">
      <Heading size="sm" my="1vh">
        Price Distribution
      </Heading>
      <QueryContainer isLoading={isFetching} isError={isError}>
        <Divider />
        <TableContainer
          w="100%"
          justifyContent={'center'}
          my="1vh"
          maxH="20vh"
          overflowY="scroll"
        >
          <Table variant="unstyled" size="sm">
            <Thead>
              <Tr>
                <Th>To</Th>
                <Th>Percentage</Th>
                <Th>Amount (eth)</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Shopychange</Td>
                <Td>{marketplaceRoyalty}</Td>
                <Td>{fixedNumber((settedPrice * marketplaceRoyalty) / 100)}</Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="sm" as="i" mt="6px" mb="0" ml="4px">
                    The remaining {100 - marketplaceRoyalty}% is separated as
                    follows
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td>{isOwner ? 'You' : 'Owner'}</Td>
                <Td>{100 - otherRoyaltiesSum}</Td>
                <Td>
                  {fixedNumber(
                    (remainingValue / 100) * (100 - otherRoyaltiesSum)
                  )}
                </Td>
              </Tr>
              {otherRoyalties.map((royalty) => (
                <Tr key={royalty.receiver}>
                  <Td>
                    {' '}
                    {renderAddress(
                      royalty.receiver,
                      `/account/${royalty.receiver}`
                    )}
                  </Td>
                  <Td>{royalty.share}</Td>
                  <Td>{fixedNumber((remainingValue / 100) * royalty.share)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Divider />
      </QueryContainer>
    </Box>
  )
}
