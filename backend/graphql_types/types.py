import graphene
from graphene_django import DjangoObjectType


class Contract(graphene.ObjectType):
    name = graphene.String()
    symbol = graphene.String()
    address = graphene.String()


class NFT(graphene.ObjectType):
    contract_address = graphene.String()
    token_id = graphene.Int()
    image = graphene.String()
    name = graphene.String()


class Attribute(graphene.ObjectType):
    trait_type = graphene.String()
    value = graphene.String()


class NFTComplete(graphene.ObjectType):
    nft = graphene.Field(NFT)
    owner = graphene.String()
    description = graphene.String()
    attributes = graphene.List(Attribute)
    contract = graphene.Field(Contract)
    token_type = graphene.String()


class Collection(graphene.ObjectType):
    contract = graphene.Field(Contract)
    nfts = graphene.List(NFT)


class Sale(graphene.ObjectType):
    nft = graphene.Field(NFT)
    seller = graphene.String()
    price = graphene.Float()
    status = graphene.Int()


##########
# Events #
##########

class EventType(graphene.Enum):
    Mint = 'Mint'
    Burn = 'Burn'
    Transfer = 'Transfer'
    Approval = 'Approval'
    ApprovalForAll = 'ApprovalForAll'
    SaleCreated = 'SaleCreated'
    SalePriceModified = 'SalePriceModified'
    SaleCancelled = 'SaleCancelled'
    SaleBought = 'SaleBought'


class EventGeneric(graphene.ObjectType):
    date = graphene.String()  # timestamp in ms


class EventTransfer(EventGeneric):
    from_address = graphene.String()
    to_address = graphene.String()


class EventApproval(EventGeneric):
    owner = graphene.String()
    approved = graphene.String()


class EventApprovalForAll(EventGeneric):
    owner = graphene.String()
    operator = graphene.String()
    is_approved = graphene.Boolean()


class EventMint(EventGeneric):
    to_address = graphene.String()


class EventBurn(EventGeneric):
    from_address = graphene.String()


class EventSaleCreated(EventGeneric):
    seller = graphene.String()
    price = graphene.Float()


class EventSalePriceModified(EventGeneric):
    seller = graphene.String()
    previous_price = graphene.Float()
    price = graphene.Float()


class EventSaleCancelled(EventGeneric):
    seller = graphene.String()


class EventSaleBought(EventGeneric):
    seller = graphene.String()
    buyer = graphene.String()
    price = graphene.Float()


class Event(graphene.Union):
    class Meta:
        types = (EventTransfer, EventApproval,
                 EventApprovalForAll, EventMint, EventBurn, EventSaleCreated, EventSalePriceModified, EventSaleCancelled, EventSaleBought)


###########
# Royalty #
###########

class Royalty(graphene.ObjectType):
    receiver = graphene.String()
    share = graphene.Float()


class ShopychangeRoyaltyCollection(graphene.ObjectType):
    royalties = graphene.List(Royalty)
    royalty_sum = graphene.Float()
    supports_erc2981_multi_receiver = graphene.Boolean()
    supports_erc2981 = graphene.Boolean()
    has_payment_splitter = graphene.Boolean()


class ShopychangeRoyaltyToken(graphene.ObjectType):
    royalties = graphene.List(Royalty)
    royalty_sum = graphene.Float()
    supports_erc2981_multi_receiver = graphene.Boolean()
    supports_erc2981 = graphene.Boolean()
    is_collection_default = graphene.Boolean()
    has_payment_splitter = graphene.Boolean()


class WithdrawReceiverInfo(graphene.ObjectType):
    receiver = graphene.String()
    amount = graphene.Float()


class WithdrawPaymentSplitterInfo(graphene.ObjectType):
    payment_splitter_address = graphene.String()
    receivers = graphene.List(WithdrawReceiverInfo)
