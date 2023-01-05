import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'

function SignIn() {

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(
        auth, email, password
      )

      if (userCredential.user) {
        navigate('/profile')
      }
    } catch (error) {
      toast.error('Bad user credentials')
    }

  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome back!</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input type="email" id='email' value={email}
              onChange={onChange}
              placeholder='Email' className="emailInput" />
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text' : 'password'}
                className='passwordInput' placeholder='Password'
                id='password' value={password} onChange={onChange} />
              <img src={visibilityIcon} alt="show password"
                onClick={() => setShowPassword((prevState) => !prevState)}
                className="showPassword" />
            </div>
            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>
            <div className="signInBar">
              <p className="signInText">Sign in</p>
              <button className="signInButton">
                <ArrowRightIcon fill='#ffffff' width='34px'
                  height='34px' />
              </button>
            </div>
          </form>

          <OAuth />

          <Link to='/sign-up' className='registerLink'>
            Sign up instead
          </Link>
        </main>
      </div>
    </>
  )
}

export default SignIn