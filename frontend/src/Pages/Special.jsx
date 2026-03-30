import React from 'react'
import ProductGallery from '../components/ProductGallery.jsx'

const Special = () => {
  return (
    <div>
      {/* We call the gallery and tell it which ageGroup to filter for */}
    <ProductGallery productType="Special"/>
    </div>
  )
}

export default Special