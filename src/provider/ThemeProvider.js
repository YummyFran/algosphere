import React, {useContext, useEffect} from 'react'
import { getTheme, setTheme } from '../utils/firestore'
import { useUser } from './UserProvider'
import { useMutation, useQuery } from '@tanstack/react-query'

const ThemeContext = React.createContext()

export const useTheme = () => {
    return useContext(ThemeContext)
}

const ThemeProvider = ({children}) => {
    const [UItheme, setUITheme] = React.useState('light')
    const [user] = useUser()

    const { 
        data: themeData
    } = useQuery({
        queryKey: ['theme', user?.uid],
        queryFn: async () => await getTheme(user),
        enabled: !!user
    })

    const { mutate: mutateTheme } = useMutation({
        mutationFn: async () => {
            toggleTheme()
        }
    })

    useEffect(() => {
        setUITheme(themeData)
    }, [themeData])

    const toggleTheme = async () => {
        const newTheme = UItheme === 'dark' ? 'light' : 'dark'
        setUITheme(newTheme)
        await setTheme(user, newTheme)
    }
    
  return (
    <ThemeContext.Provider value={[UItheme, mutateTheme]}>
        {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider