import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/APIcalls'

import styles from '../styles/Username.module.css'


const Recovery = () => {
  const navigate = useNavigate()
  const { username } = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState()

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      // console.log(OTP)
      if (OTP) return toast.success('OTP has been sent to email')
      return toast.error('Problem occurred while generating OTP')
    })
  }, [username])

  async function onSubmit(e) {
    e.preventDefault()

    try {
      let { status } = await verifyOTP({ username, code: OTP })
      if (status === 201) {
        toast.success('Verified Successfully')
        return navigate('/reset')
      }
    }
    catch (err) {
      return toast.error('Wrong OTP! Check email again')
    }
  }


  function resendOTP() {
    setOTP()
    let sendPromise = generateOTP(username)

    toast.promise(sendPromise, {
      loading: 'Sending...',
      success: <b>OTP has been sent to email</b>,
      error: <b>could not sent OTP</b>
    })

    // sendPromise.then(OTP => console.log(OTP))
  }


  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className='title flex flex-col items-center'>
            <h4 className='text-4xl font-bold'>Recovery</h4>
            <span className='py-4 text-l text-center text-gray-5'>
              Enter OTP to recover password
            </span>
          </div>

          <form className='pt-20' onSubmit={onSubmit}>
            <div className='textbox flex flex-col items-center gap-6'>
              <span className='py-4 text-sm text-left text-gray-500'>Enter 6 digit OTP sent to your email address</span>
              <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type='text' placeholder='OTP' />
              <button type='submit' className={styles.btn}>Recover</button>
            </div>

          </form>
          <div className="text-center py-4">
            <span className='text-gray-400'>Can't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Recovery