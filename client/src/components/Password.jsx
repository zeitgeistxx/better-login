import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import useFetch from '../hooks/useFetch'
import { login } from '../helper/APIcalls'

import styles from '../styles/Username.module.css'
import { passwordValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

const Password = () => {
  const navigate = useNavigate()

  const { username } = useAuthStore((state) => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`)

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      let loginPromise = login({ username, password: values.password })
      toast.promise(loginPromise, {
        loading: 'Logging in...',
        success: <b>Login Successfull</b>,
        error: <b>Password not match</b>
      })

      loginPromise.then((res) => {
        let { token } = res
        localStorage.setItem('token', token)
        navigate('/profile')
      })
    }
  })

  if (isLoading) return <h3 className='text-2xl font-bold'>isLoading</h3>
  if (serverError) return <h3 className='text-2xl text-red-500'>{serverError.message}</h3>


  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className='title flex flex-col items-center'>
            <h4 className='text-4xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-l w-2/3 text-center text-gray-5'>
              Explore More by connecting with peers
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={apiData?.profile || avatar} className={styles.profile_img} />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input {...formik.getFieldProps('password')} className={styles.textbox} type='password' placeholder='Password' />
              <button type='submit' className={styles.btn}>Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-400'>Forgot Password? <Link className='text-red-500' to='/recovery'>Recover Now</Link></span>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Password