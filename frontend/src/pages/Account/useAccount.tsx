import { useMediaQuery } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { SidebarData } from '../../data/accountSidebarData'

export default function useAccount() {
  const navigate = useNavigate()
  // Media query for mobile
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  const changeActivePage = (element: SidebarData) => {
    navigate(`/account/dashboard/${element.route}`)
  }

  return {
    isMobile,
    changeActivePage,
  }
}
