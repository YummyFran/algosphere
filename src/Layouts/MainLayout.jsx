import React, { useEffect, useRef } from 'react'
import { Navigate, Outlet } from 'react-router'
import LeftPanel from '../components/LeftPanel'
import { useUser } from '../provider/UserProvider'
import '../styles/mainLayout.css'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../utils/firestore'

const MainLayout = () => {
    const [user, loading] = useUser()
    const menuRef = useRef()
    const menuMobileRef = useRef()

    const closeMenu = e => {
      if(e.target.className === 'meatball-menu') return

      menuRef.current.classList.remove('show')
      menuMobileRef.current.classList.remove('show')
    }

    const { data: currentUser, isLoading } = useQuery({
      queryKey: ['user', { user }],
      queryFn: async () => await getUser(user.uid)
    })

    useEffect(() => {
      window.addEventListener('click', closeMenu)

      return () => {
        window.removeEventListener('click', closeMenu)
      }
    }, [])

    if(!user) return <Navigate to='/login' />
  return (
    <div className='main'>
        <LeftPanel user={currentUser} isLoading={isLoading} menuRef={menuRef} menuMobileRef={menuMobileRef}/>
        <Outlet />
    </div>
  )
}

export default MainLayout