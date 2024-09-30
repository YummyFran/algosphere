import React, {useContext, useEffect} from 'react'
import { getTheme, setTheme } from '../utils/firestore'
import { useUser } from './UserProvider'

const ThemeContext = React.createContext()

export const useTheme = () => {
    return useContext(ThemeContext)
}

const ThemeProvider = ({children}) => {
    const [UItheme, setUITheme] = React.useState('light')
    const [user, loading] = useUser()

    const toggleTheme = async () => {
        const newTheme = UItheme === 'dark' ? 'light' : 'dark'
        setUITheme(newTheme)
        await setTheme(user, newTheme)
    }

    useEffect(() => {
        if(!user) return

        const checkTheme = async () => {
            const themeData = await getTheme(user)

            setUITheme(themeData === 'dark' ? 'dark' : 'light')
        }

        checkTheme()
    }, [user])
    
  return (
    <ThemeContext.Provider value={[UItheme, toggleTheme]}>
        {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider