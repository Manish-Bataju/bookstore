import {Featured_Enum, Genres_Enum, Special_Enum, Stationery_Enum } from "../../../Shared/enums.js";
import ProductCard from "./ProductCard";

const ProductGallery = ({ categoryType, allBooks }) => {

    const getEnum = () => {
        if (categoryType === "Genres") return Genres_Enum;
        if (categoryType === "Featured") return Featured_Enum;
        if (categoryType === "Special") return Special_Enum;
        if (categoryType === "Stationery") return Stationery_Enum;
        return [];
    };
    

    const currentEnum = getEnum();

    return (
        <div>
            {currentEnum.map((section) => {

                //filter the book according to the section..
                const sectionBooks = allBooks.filter(book => book.category.subCategory === section.label)

                //in case the section has no books then the return is null
                if (sectionBooks.length === 0) return null;

                return (
                    <section key={section.label} className="flex flex-col gap-4">
                        {/* section Header */}
                        <div>
                            <div>
                                <h2>{section.label}</h2>
                                {section.children.map((tag) => (
                                <span key={tag}>{tag}</span>
                                 ))}
                            </div>
                            <button>View All</button>
                            </div>
                        {/* the horizontal scroll of books */}
                            <div>
                                {sectionBooks.map(book=>
                                    <ProductCard key={book._id} book={book}/>
                                )}
                            </div>
                    </section>
                )})}
        </div>
    );
};

 export default ProductGallery;