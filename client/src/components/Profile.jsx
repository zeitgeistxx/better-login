import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'
import useFetch from '../hooks/useFetch'
import { updateUser } from '../helper/APIcalls'


const Profile = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState()
  const [{ isLoading, apiData, serverError }] = useFetch()


  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      mobile: apiData?.mobile || '',
      email: apiData?.email || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' })
      let updatePromise = updateUser(values)
      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Updated Successfully</b>,
        error: <b>Couldn't not update</b>
      })
    }
  })


  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
  }

  const userLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }


  if (isLoading) return <h3 className='text-2xl font-bold'>isLoading</h3>
  if (serverError) return <h3 className='text-2xl text-red-500'>{serverError.message}</h3>


  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: '40%', padding: '30px 20px 1px 20px' }}>

          <div className='title flex flex-col items-center'>
            <h4 className='text-4xl font-bold'>Profile</h4>
            <span className='py-4 text-l w-2/3 text-center text-gray-5'>
              You may update the details
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
                <img src={apiData?.profile || file || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt='avatar' />
              </label>

              <input type='file' onChange={onUpload} id='profile' name='profile' />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='First Name' />
                <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='Last Name' />
              </div>

              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='Mobile no.' />
                <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='Email' />
              </div>

              <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='Address' />
              <button type='submit' className={styles.btn}>Update</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-400'>come back later? <button className='text-red-500' onClick={userLogout}> Logout </button></span>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Profile