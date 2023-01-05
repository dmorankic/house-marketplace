import React, { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import { toast } from 'react-toastify'


function Profile() {
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const { name, email } = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc'))
      const querySnap = await getDocs(q)

      let listings = []
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogOut = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      // update in firebase
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name })

        //update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, { name })
      }
    } catch (error) {

    }
  }
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onDelete=async(listingId)=>{
    if(window.confirm('Are you sure you want to delete?')){
      const docRef=doc(db,'listings',listingId)
      await deleteDoc(docRef)
      const updatedListings=listings.filter((listing)=>
      listing.id!==listingId)
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  const onEdit=(listingId)=> navigate(`/edit-listing/${listingId}`)

  return <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader">My profile</p>
      <button className="logOut" type='button'
        onClick={onLogOut}>Log out</button>
    </header>

    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal details</p>
        <p className="changePersonalDetails" onClick={() => {
          changeDetails && onSubmit()
          setChangeDetails((prevState) => !prevState)
        }}>
          {changeDetails ? 'done' : 'change'}
        </p>
      </div>
      <div className="profileCard">
        <form >
          <input type="text" className={!changeDetails ?
            'profileName' : 'profileNameActive'} id="name"
            disabled={!changeDetails} value={name} onChange={onChange} />
          <input type="text" className={!changeDetails ?
            'profileEmail' : 'profileEmailActive'} id="email"
            disabled={!changeDetails} value={email} onChange={onChange} />
        </form>
      </div>
      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt="alt" />
        <p>Sell or rent your home</p>
        <img src={arrowRight} alt="arrow right" />

      </Link>
      {!loading && listings?.length > 0 && (
        <>
          <p className="listingText">Your listings</p>
          <ul className="listingsList">
            {listings.map((listing) => (
              <ListingItem key={listing.id} listing={listing.data}
                id={listing.id} onDelete={()=>onDelete(listing.id)}
                onEdit={()=>onEdit(listing.id)} />
            ))}
          </ul>
        </>
      )}
    </main>
  </div>
}

export default Profile