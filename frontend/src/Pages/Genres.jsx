import React from 'react'
import ProductGallery from '../components/ProductGallery.jsx'

const Genres = () => {
  return (
    <div className='w-95[vw] mx-auto'>  
    {/* We call the gallery and tell it which ageGroup to filter for */}
    <ProductGallery productType= "Genres"/>
    </div>
  )
}

export default Genres