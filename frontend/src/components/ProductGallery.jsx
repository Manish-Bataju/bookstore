import useShop from "@/hooks/useShop.js";
import { Featured_Enum, Genres_Enum, Special_Enum, Stationery_Enum } from "../../../Shared/enums.js";
import ProductCard from "./ProductCard";

const ProductGallery = ({ productType }) => {
    const { books, loading } = useShop();

    const normalProductType = productType?.toLowerCase();

    //fetch all the book that belongs to the main category
    const currentProductTypeBooks = books.filter(book => book.category.productType === productType);


    const getEnum = () => {
        if (normalProductType === "genres") return Genres_Enum;
        if (normalProductType === "featured") return Featured_Enum;
        if (normalProductType === "special") return Special_Enum;
        if (normalProductType === "stationery") return Stationery_Enum;
        return [];
    };

    const currentEnum = getEnum();

    //if loading is true then it carries forward otherwise it returns from here
    if (loading) {
        return <div className="text-center p-10">Loading books ...</div>
    }

    // return the actual gallery
    return (
        <div className="w-full mx-auto px-5">
            {currentEnum.map((subCategory, index) => {

                const sectionBooks = currentProductTypeBooks.filter(book => book.category.main === subCategory.label)
                //Don't show the category heading if there are no books
                if (sectionBooks.length === 0) return null;

                return (
                    <div className="pb-10" key={subCategory.label} >
                        {index > 0 && (
                            <hr className="h-3 w-full bg-foreground-500 border-0 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] mb-5 mt-1" />
                        )}

                        <div>
                            <h2 className="heading-lg pl-10 mb-4">{subCategory.label}</h2>
                            <div className="grid justify-items-center mx-auto max-mls:grid-cols-1 max-mls:gap-2 tp:grid-cols-2 tp:gap-2  tls:grid-cols-3 tls:gap-3 lp:grid-cols-5 " >
                                {sectionBooks.map(book => (
                                    <ProductCard key={book._id} book={book} />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
};

export default ProductGallery;