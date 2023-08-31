import graphene
from graphene_federation import build_schema

import blockchainAPI.schema
import marketplaceAPI.schema
import databaseAPI.schema


class Query(
    blockchainAPI.schema.Query,
    marketplaceAPI.schema.Query,
    databaseAPI.schema.Query,
    graphene.ObjectType
):
    # Merge the queries from schemas
    pass


class Mutation(
    databaseAPI.schema.Mutation,
    graphene.ObjectType
):
    # Merge the mutations from schemas
    pass


schema = build_schema(query=Query, mutation=Mutation)
