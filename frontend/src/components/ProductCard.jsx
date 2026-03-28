import useShop from "@/hooks/useShop.js";
import { Star } from "lucide-react";

const ProductCard = ({ book}) => {

    const {user}= useShop();

    const hasDiscount = book.discountType !== "None" && book.discountType === 0;

    return (

        <div className="flex flex-col items-centre shadow-2xl drop-shadow-2xl rounded-t-2xl overflow-hidden bg-white/30 w-83 pb-3 ">

            <div className="relative flex flex-col items-center justify-center">
                {/* Image Container */}
                <img src={book?.bookImage?.coverImage} alt={book.title} className="drop-shadow-red-500 h-125" />

                {/* discount badge top right */}
                {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white body-reading">
                        {book.discountType === 'Percentage' ? `{book.discountAmount}%` : `OFF Rs{book.discountAmount}`}
                    </div>
                )}
            </div>

            {/* Book Info */}
            <div className="flex flex-col gap 0.5 mt-5 gap-1 px-4">
                <h4 className="heading-md text-blue-600 text-center line-clamp-1">{book.title}</h4>
                <div className="flex justify-between items-center mt-1">

                    {/* rating System */}
                    <div className="flex flex-col gap-2">
                        <Star size={10} className="fill-yellow-500 text-yellow-500" />
                        <div className="flex gap-4 justify-center items-center">
                            <span>{book.averageRating > 0 ? book.averageRating : "New Reviews"} </span>
                            <span className="text-gray-500 text-[14px]">{book.totalReviews}</span>
                        </div>
                    </div>

                    {/* Pricing Info */}
                    <div>
                        <span className="font-bold">NRs {book.finalPrice}</span>
                        {hasDiscount && (
                            <span className="text-gray-500 text-[11px] line-through decoration-red-500">Rs. {book.sellingPrice}</span>
                        )}
                    </div>
                </div>
                <div>
                    {/* Marketing tags */}
                    {book.tags?.[0] && (
                        <span className="absolute top-0 left-4 bg-red-500 px-2 text-white text-sub-heading drop-shadow-2xl">
                            {book.tags[0]}</span>
                    )}
                </div>


                {/* Availability  */}
                <p className={`text-[14px] font-bold uppercase ${book.totalBookLeft > 0 ? "text-green-500 items-start" : 'text-red-500'}`}>
                    {book.totalBookLeft > 0 ? "In Stock" : "Out of Stock"}</p>
                {book.brand ? `Brand: {book.brand}` : null}

                <div className="flex justify-between items-center">
                    <span>Final Price:<span className="font-bold"> NRs. {book.finalPrice}</span> </span>
                    {user?.role === "admin" && (
                        <button type="submit" className="btn-primary">Edit</button>)}
                </div>
                
            </div>

        </div>
    )
};

export default ProductCard;