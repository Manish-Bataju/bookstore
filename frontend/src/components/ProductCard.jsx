import { Star } from "lucide-react";

const ProductCard = ({book}) => {

    const hasDiscount = book.discountType !== "None" && book.discountType === 0;
    return (
      <div className="flex flex-col justify-center items-centre">

        <div className="relative">
            {/* Image Container */}
        <img src="{book.image}" alt="{book.title}" width={[300]} height={[600]} />

        {/* discount badge top right */}
        {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-body-reading">
                {book.discountType === 'Percentage'? `{book.discountAmount}%` : `OFF Rs{book.discountAmount}`}
            </div>
        )}

        {/* Marketing tags */}
        {book.tags?.[0] && (
            <span className="absolute top-2 left-2 bg-orange-500 text-black text-sub-heading">
                {book.tags[0]}</span>
        )}
        </div>

        {/* Book Info */}
        <div className="flex flex-col gap 0.5 px-1">
         <h3>{book.title}</h3>
         
        <div className="flex justify-between items-baseline">
             {/* rating System */}
        <div>
            <Star size={10} className="fill-yellow-500 text-yellow-500"/>'
            <span>{book.averageRating>0? book.averageRating : "New"} </span>
            <span className="text-gray-500 text-[9px]">{book.totalReviews}</span>
        </div>
        
        {/* Pricing Info */}
        <div>
            <div>
                <span>Rs{book.finalPrice}</span>
                {hasDiscount && (
                    <span className="text-gray-500 text-[11px] line-through decoration-red-500">Rs. {book.sellingPrice}</span>
                )}
            </div>
        </div>
        </div>

        {/* Availability  */}
        <p className={`text-[9px] font-bold uppercase mt-1 ${book.totalBookLeft > 0? "text-green-500" : 'text-red-500'}`}>
            {book.totalBookLeft > 0? "In Stock" : "Out of Stock"}</p>
        

        </div>
        

       
        <h4>{book.brand}</h4>
        <span>{book.finalPrice}</span>
      </div>  
    )
  };

  export default ProductCard;