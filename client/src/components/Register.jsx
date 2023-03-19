import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import styles from '../styles/Username.module.css'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { registerUser } from '../helper/APIcalls'

const Register = () => {

  const navigate = useNavigate()
  const [file, setFile] = useState()


  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || '' })
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Registered Successfully</b>,
        error: <b>Could not Register</b>
      })

      registerPromise.then(() => navigate('/'))
    }
  })


  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
  }


  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: '40%', padding: '30px 20px 1px 20px' }}>

          <div className='title flex flex-col items-center'>
            <h4 className='text-4xl font-bold'>Register</h4>
            <span className='py-4 text-l w-2/3 text-center text-gray-5'>
              Happy to join you!
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
                <img src={file || avatar} className={styles.profile_img} alt='avatar' />
              </label>

              <input type='file' onChange={onUpload} id='profile' name='profile' />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input {...formik.getFieldProps('email')} className={styles.textbox} type='text' placeholder='Email*' />
              <input {...formik.getFieldProps('username')} className={styles.textbox} type='text' placeholder='Usename*' />
              <input {...formik.getFieldProps('password')} className={styles.textbox} type='password' placeholder='Password*' />
              <button type='submit' className={styles.btn}>Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-400'>Already Registered? <Link className='text-red-500' to='/'> Login </Link></span>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Register