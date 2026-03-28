import ProductGallery from '../Components/ProductGallery.jsx'

const Rent = () => {
  return (
    <div>{/* We call the gallery and tell it which ageGroup to filter for */}
    {/* <ProductGallery categoryTitle="Rent"/> */}
    <ProductGallery productType="Rent"/>
    </div>
  )
}

export default Rent