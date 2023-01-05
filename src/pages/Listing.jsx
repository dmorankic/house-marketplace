import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useFetcher, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';



function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fecthListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fecthListing()
    }, [navigate, params.listingId])

    if (loading) {
        return <Spinner />
    }
    const formatPrice = (price) => {
        return price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    return <main>
        {/* <Swiper  modules={[Navigation, Pagination, Scrollbar, A11y]}
         slidesPerView={1} pagination={{ clickable: true }}>

            {listing.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div style={{
                        background: `url(${listing.imgUrls[index]})
                center no-repeat`,
                        backgroundSize: 'cover'
                    }}
                        className="swiperSlideDiv">

                    </div>

                </SwiperSlide>
            ))}
        </Swiper> */}

        <Swiper 
         modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}

        pagination={{ clickable: true }}>
            {listing.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div
                        style={{
                            background: `url(${listing.imgUrls[index]}) center no-repeat`,
                            backgroundSize: 'cover',
                            height:'200px'
                        }}
                        className='swiperSlideDiv'
                    ></div>
                </SwiperSlide>
            ))}
        </Swiper>

        <div className="shareIconDiv" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(() => {
                setShareLinkCopied(false)
            }, 2000);
        }}>
            <img src={shareIcon} alt="" />
        </div>
        {shareLinkCopied && <p className='linkCopied'>Link copied</p>}
        <div className="listingDetails">
            <p className="listingName">{listing.name}
                - ${listing.offer ? formatPrice(listing.discountedPrice)
                    : formatPrice(listing.regularPrice)}</p>
            <p className="listingLocation">{listing.location}</p>
            <p className="listingType">
                For {listing.type}
            </p>
            {listing.offer && (
                <p className="discountPrice">${listing.regularPrice -
                    listing.discountedPrice} discount</p>
            )}
            <ul className="listingDetailsList">
                <li>
                    {listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms`
                        : `1 bedroom`}
                </li>
                <li>
                    {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms`
                        : `1 bathroom`}
                </li>
                <li>{listing.parking && 'Parking spot'}</li>
                <li>{listing.furnished && 'furnished'}</li>

            </ul>
            <p className="listingLocationTitle">Location</p>

            <div className="leafletContainer">
                <MapContainer style={{
                    height: '100%',
                    width: '100%'
                }} center={[listing.geolocation.lat,
                listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    />
                    <Marker position={[listing.geolocation.lat,
                    listing.geolocation.lng]}>
                        <Popup>{listing.location}</Popup>
                    </Marker>

                </MapContainer>
            </div>

            {auth.currentUser?.uid !== listing.userRef &&
                (
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name
                        }`}
                        className='primaryButton'>
                        Contact Landlord
                    </Link>
                )}
        </div>
    </main>
}

export default Listing