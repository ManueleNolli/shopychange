import React from 'react'
import { NFTHistoryTableProps } from '../../types/props/NFTHistoryTableProps'
import {
  Center,
  Flex,
  Text,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {
  EventApproval,
  EventApprovalForAll,
  EventMint,
  EventNFT,
  EventTransfer,
  EventType,
  EventBurn,
  EventSaleCreated,
  EventSalePriceModified,
  EventSaleCancelled,
  EventSaleBought,
} from '../../types/components/Events'
import { formatDate } from '../../utils/FormatDate/FormatDate'
import { correctDate } from '../../utils/CorrectDate/CorrectDate'

import { IoIosHammer } from 'react-icons/io' //Mint
import { BiTransfer } from 'react-icons/bi' //Transfer
import { IoCheckmarkDone } from 'react-icons/io5' //Approval
import { IoCheckmark } from 'react-icons/io5' //ApprovalForAll true
import { MdOutlineRemoveDone } from 'react-icons/md' //ApprovalForAll false
import { FaBurn } from 'react-icons/fa' //Burn
import { FaTimes } from 'react-icons/fa' //Cancel Sale
import { FaPen } from 'react-icons/fa' //Modify Sale
import { FaShoppingCart } from 'react-icons/fa' //Buy Sale
import { ImPriceTag } from 'react-icons/im' //Create Sale
import { FaLongArrowAltRight } from 'react-icons/fa'

import { renderAddress } from '../../utils/SimplifiedAddress/SimplifiedAddress'
import useNFTHistoryTable from './useNFTHistoryTable'

export default function NFTHistoryTable({ nftHistory }: NFTHistoryTableProps) {
  const { history } = useNFTHistoryTable({ nftHistory })

  return (
    <TableContainer maxW={{ base: '80vw', md: '70vw' }}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>From / Seller / Owner</Th>
            <Th>To / Buyer / Approved</Th>
            <Th>Price</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {history.map((event, index) => {
            return renderEvent(event, index)
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

/* eslint-disable */
function renderEvent(event: EventNFT, index: number) {
  switch (event.__typename) {
    case EventType.Mint:
      return <MintEvent event={event as EventMint} key={index} />
    case EventType.Transfer:
      return <TransferEvent event={event as EventTransfer} key={index} />
    case EventType.Approval:
      return <ApprovalEvent event={event as EventApproval} key={index} />
    case EventType.ApprovalForAll:
      return (
        <ApprovalForAllEvent event={event as EventApprovalForAll} key={index} />
      )
    case EventType.Burn:
      return <BurnEvent event={event as EventBurn} key={index} />
    case EventType.SaleCreated:
      return <SaleCreatedEvent event={event as EventSaleCreated} key={index} />
    case EventType.SalePriceModified:
      return (
        <SalePriceModifiedEvent
          event={event as EventSalePriceModified}
          key={index}
        />
      )
    case EventType.SaleCancelled:
      return (
        <SaleCancelledEvent event={event as EventSaleCancelled} key={index} />
      )
    case EventType.SaleBought:
      return <SaleBoughtEvent event={event as EventSaleBought} key={index} />
  }
}
/* eslint-enable */

type MintEventProps = {
  event: EventMint
}
function MintEvent({ event }: MintEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          <IoIosHammer size={'24'} />
          <Text ml="2">Mint</Text>
        </Flex>
      </Td>
      <Td />
      <Td>{renderAddress(event.toAddress, `/account/${event.toAddress}`)}</Td>
      <Td />
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}

type TransferEventProps = {
  event: EventTransfer
}
function TransferEvent({ event }: TransferEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          <BiTransfer size={'24'} />
          <Text ml="2">Transfer</Text>
        </Flex>
      </Td>
      <Td>
        {renderAddress(event.fromAddress, `/account/${event.fromAddress}`)}
      </Td>
      <Td>{renderAddress(event.toAddress, `/account/${event.toAddress}`)}</Td>
      <Td />
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}

type ApprovalEventProps = {
  event: EventApproval
}

function ApprovalEvent({ event }: ApprovalEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          <IoCheckmark size={'24'} />
          <Text ml="2">Approval</Text>
        </Flex>
      </Td>
      <Td>{renderAddress(event.owner, `/account/${event.owner}`)}</Td>
      <Td>{renderAddress(event.approved, `/account/${event.approved}`)}</Td>
      <Td />
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}

type ApprovalForAllEventProps = {
  event: EventApprovalForAll
}
function ApprovalForAllEvent({ event }: ApprovalForAllEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          {event.isApproved ? (
            <IoCheckmarkDone size={'24'} />
          ) : (
            <MdOutlineRemoveDone size={'24'} />
          )}
          {event.isApproved ? (
            <Text ml="2">Approval For All</Text>
          ) : (
            <Text ml="2">Removed Approval For All</Text>
          )}
        </Flex>
      </Td>
      <Td>{renderAddress(event.owner, `/account/${event.owner}`)}</Td>
      <Td>{renderAddress(event.operator, `/account/${event.operator}`)}</Td>
      <Td />
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}

type BurnEventProps = {
  event: EventBurn
}
function BurnEvent({ event }: BurnEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          <FaBurn size={'24'} />
          <Text ml="2">Burn</Text>
        </Flex>
      </Td>
      <Td>
        {renderAddress(event.fromAddress, `/account/${event.fromAddress}`)}
      </Td>
      <Td />
      <Td />
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}

type SaleCreatedEventProps = {
  event: EventSaleCreated
}
function SaleCreatedEvent({ event }: SaleCreatedEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          <ImPriceTag size={'18'} />
          <Text ml="2">Sale Created</Text>
        </Flex>
      </Td>
      <Td>{renderAddress(event.seller, `/account/${event.seller}`)}</Td>
      <Td />
      <Td>{event.price}</Td>
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}

type SalePriceModifiedEventProps = {
  event: EventSalePriceModified
}
function SalePriceModifiedEvent({ event }: SalePriceModifiedEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          <FaPen size={'18'} />
          <Text ml="2">Sale Modified</Text>
        </Flex>
      </Td>
      <Td>{renderAddress(event.seller, `/account/${event.seller}`)}</Td>
      <Td />
      <Td>
        <Flex>
          <Text>{event.previousPrice}</Text>
          <Center mx="2">
            <FaLongArrowAltRight size={'12'} />
          </Center>
          <Text>{event.price}</Text>
        </Flex>
      </Td>
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}

type SaleCancelledEventProps = {
  event: EventSaleCancelled
}
function SaleCancelledEvent({ event }: SaleCancelledEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          <FaTimes size={'24'} />
          <Text ml="2">Sale Cancelled</Text>
        </Flex>
      </Td>
      <Td>{renderAddress(event.seller, `/account/${event.seller}`)}</Td>
      <Td />
      <Td />
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}

type SaleBoughtEventProps = {
  event: EventSaleBought
}
function SaleBoughtEvent({ event }: SaleBoughtEventProps) {
  return (
    <Tr>
      <Td>
        <Flex>
          <FaShoppingCart size={'18'} />
          <Text ml="2">Sale Bought</Text>
        </Flex>
      </Td>
      <Td>{renderAddress(event.seller, `/account/${event.seller}`)}</Td>
      <Td>{renderAddress(event.buyer, `/account/${event.buyer}`)}</Td>
      <Td>{event.price}</Td>
      <Td>{formatDate(correctDate(event.date))}</Td>
    </Tr>
  )
}
