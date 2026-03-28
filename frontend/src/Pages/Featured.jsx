import React from 'react'
import ProductGallery from '../components/ProductGallery.jsx'

const Featured = () => {
  return (
    <div>{/* We call the gallery and tell it which ageGroup to filter for */}
    <ProductGallery productType="Featured"/>
    </div>
  )
}

export default Featured