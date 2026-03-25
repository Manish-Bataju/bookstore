import ProductGallery from '../Components/ProductGallery.jsx'
import ProductEditForm from '@/Forms/ProductEditForm.jsx'


const Rent = () => {
  return (
    <div>{/* We call the gallery and tell it which ageGroup to filter for */}
    {/* <ProductGallery categoryTitle="Rent"/> */}
    <ProductEditForm/>
    </div>
  )
}

export default Rent