import { useContext } from 'react'
import styles from '../styles/ThemeButton.module.css'
import { ThemeContext } from '../context/ThemeContext'

const ThemeButton = () => {

    const { darkMode, setDarkMode } = useContext(ThemeContext)

    return (
        <>
            <div className={styles.container}>
                <input type="checkbox" defaultChecked={darkMode} id={styles.themeToggle} onClick={(e) => setDarkMode(e.target.checked)} />
                <label htmlFor={styles.themeToggle}></label>
            </div>
        </>
    )
}

export default ThemeButton