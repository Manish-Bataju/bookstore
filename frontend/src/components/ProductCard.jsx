import ProductEditForm from "@/Forms/ProductEditForm.jsx";
import useShop from "@/hooks/useShop.js";
import { Star } from "lucide-react";

const ProductCard = ({ book, isRentPage  }) => {

    console

    const { user, addToCart, setBookEditingForm } = useShop();

    const hasDiscount = book.discountType !== "None" && book.discountType === 0;

    const handleAddToCart = () => {
        addToCart(book._id);
    }

   

    return (

        <div className="flex flex-col items-centre shadow-2xl drop-shadow-2xl rounded-t-2xl overflow-hidden bg-white/30 w-85 aspect-ratio:1/2 pb-3 ">

            <div className="relative flex flex-col items-center justify-center">
                {/* Image Container */}
                <img src={book?.bookImage?.coverImage} alt={book.title} className="drop-shadow-red-500 h-125 object-fit" />

                {/* discount badge top right */}
                <div>
                    {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white body-reading">
                            {book.discountType === 'Percentage' ? `{book.discountAmount}%` : `OFF Rs{book.discountAmount}`}
                        </div>
                    )}
                </div>

            </div>

            {/* Book Info */}
            <div className="flex flex-col gap 0.5 mt-3 gap-1 px-2">
                <h4 className="heading-md text-foreground text-center line-clamp-1 bg-yellow-300 py-1 bg-center -mx-4 text-shadow-2xl">{book.title}</h4>
                <h6 className="body-reading"><em>{book.author}</em></h6>
                <div className="flex flex-col">
                    {/* Marketing tags */}
                    <span >Tags: </span>
                    <div>
                        {book.tags?.slice(0, 3).map((tag, index) => (
                            <span className="font-sans text-[15px] drop-shadow-2xl" key={`${tag}-${index}`} >
                                <em>{tag} </em> {index < 2 && index < book.tags.length - 1 && ", "}
                            </span>
                        ))}
                    </div>


                </div>
                <div className="flex justify-between items-center mt-1">


                    {/* Availability  */}
                    {book.totalBookLeft > 0 ? <span className="text-green-500">In Stock</span> : <span className="text-red-500">Out of Stock</span>}


                    {/* Pricing Info */}
                    <div className="price-display">
                        {book.isForRent && isRentPage ? (
                            // 1. RENTAL DISPLAY
                            <span className="font-bold text-blue-600 text-1.5">
                                Rent: NRs. {book.rentalPrice} <small className="text-xs font-normal">/ month</small>
                            </span>
                        ) : (
                            // 2. SALE DISPLAY (Nested Check)
                            book.finalPrice !== book.sellingBasePrice ? (
                                <span className="font-bold text-red-500 text-1.25">
                                    Offer: <em>NRs. {book.finalPrice}</em>
                                </span>
                            ) : (
                                <span className="text-1.5 font-bold text-foreground">
                                    NRs. {book.sellingBasePrice}
                                </span>
                            )
                        )}
                    </div>
                </div>


                <div className="flex justify-between items-center mt-1">
                    {/* rating System */}
                    <div className="flex flex-col gap-">
                        <Star size={12} className="fill-yellow-500 text-yellow-500" />
                        <div className="flex gap-4 justify-center items-center">
                            <span>{book.averageRating > 0 ? book.averageRating : "New Reviews"} </span>
                            <span className="text-gray-500 text-[14px]">{book.totalReviews}</span>
                        </div>
                    </div>


                    {user?.role === "admin" ? (
                        //admin sees the Edit Button 
                        <button
                            type="button"
                            onClick={() => setBookEditingForm(book._id)}
                            className="btn-primary -mt-px">Edit</button>) : (
                        //user or customer sees the add to cart button 
                        <button type="button"
                            onClick={handleAddToCart}
                            className="btn-cart -mt-px">Cart</button>)}

                </div>
                {book.brand ? `Brand: {book.brand}` : null}

            </div>

        </div>
    )
};

export default ProductCard;