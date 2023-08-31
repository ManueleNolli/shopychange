import React from 'react'

import { Box, Button } from '@chakra-ui/react'
import { FaUnlock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import AdminCheck from '../../../../utils/AdminCheck/AdminCheck'

export default function AdminButton() {
  const navigate = useNavigate()

  const onNavigation = () => {
    navigate('/admin')
  }

  return (
    <AdminCheck redirectHome={false}>
      <Box>
        <Button
          data-testid="admin-button"
          aria-label="Admin"
          _focus={{ boxShadow: 'none' }}
          w="fit-content"
          borderColor={'red.500'}
          borderWidth={'2px'}
          onClick={() => onNavigation()}
        >
          <FaUnlock />
        </Button>
      </Box>
    </AdminCheck>
  )
}
