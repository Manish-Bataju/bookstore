import React from 'react'
import ProductGallery from '../Components/ProductGallery.jsx'

const Genres = () => {
  return (
    <div>  
    {/* We call the gallery and tell it which ageGroup to filter for */}
    <ProductGallery categoryTitle="Genres"/>
    </div>
  )
}

export default Genres