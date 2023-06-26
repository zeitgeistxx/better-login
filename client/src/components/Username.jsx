import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'

import styles from '../styles/Username.module.css'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'
import { ThemeContext } from '../context/ThemeContext'
import ThemeButton from './ThemeButton'


const Username = () => {

  const navigate = useNavigate()
  const setUsername = useAuthStore((state) => state.setUsername)

  const { darkMode } = useContext(ThemeContext)


  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setUsername(values.username)
      navigate('/password')
    }
  })

  const googleAuth = () => {
    window.open(`${process.env.REACT_APP_SERVER_DOMAIN}/api/auth/google`, '_self')
  }

  const logout = () => {
    window.open(`${process.env.REACT_APP_SERVER_DOMAIN}/api/logout`, '_self')
  }


  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>

        <div className={darkMode ? styles.darkGlass : styles.glass}>

          <div className='title flex flex-col items-center'>
            <h4 className='text-4xl font-bold'>Hello Again!</h4>
            <span className='py-4 text-l w-2/3 text-center text-gray-5'>
              Explore More by connecting with peers
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={avatar} className={styles.profile_img} alt='avatar' />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input {...formik.getFieldProps('username')} className={styles.textbox} type='text' placeholder='Username' />
              <button type='submit' className={styles.btn}>Lets Go</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-400'>Not a Member <Link className='text-red-500' to='/register'>Register Now</Link></span>
            </div>
          </form>

          <div className='flex justify-center'>
            <button className={styles.btn} style={{ background: '#171717', position: 'absolute' }} onClick={googleAuth}>Sign in with Google</button>
          </div>
        </div>

        <div className={styles.utils}>
          <ThemeButton />

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" id={styles.logout} onClick={logout}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </div>

      </div>
    </div>
  )
}

export default Username