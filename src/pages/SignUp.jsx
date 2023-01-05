import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { getAuth, createUserWithEmailAndPassword, updateProfile }
  from 'firebase/auth'
import { db } from '../firebase.config'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'


function SignUp() {

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const { email, password, name } = formData
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
      const userCredential = await createUserWithEmailAndPassword(
        auth, email, password
      )
      const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = { ...formData }
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')
    } catch (error) {
      toast.error('Something went wrong with registration')
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
            <input type="text" id='name' value={name}
              onChange={onChange}
              placeholder='Name' className="nameInput" />
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
            <div className="signUpBar">
              <p className="signUpText">Sign up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill='#ffffff' width='34px'
                  height='34px' />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to='/sign-in' className='registerLink'>
            Sign in instead
          </Link>
        </main>
      </div>
    </>
  )
}

export default SignUp