import React from 'react'

export const divWithChildrenMock = (children: any, identifier: string) => (
  <div data-testid={identifier}>{children}</div>
)
export const divWithoutChildrenMock = (identifier: string) => (
  <div data-testid={identifier} />
)
