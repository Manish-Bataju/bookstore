import { Category_Map, Category_Config } from "@/data/CategoryConfig.js";
import { useWatch } from "react-hook-form";
import { Category_Enum } from "../../../Shared/enums.js";


const CategorySelector = ({ register, setValue, control }) => {

    const selectedProductType = useWatch({control, name: "category.productType"});
    const selectedMainLabel = useWatch({control, name:"category.main"});

    const mainOptions = selectedProductType ? Category_Map[selectedProductType] : [];
    const activeMainObject = mainOptions.find(item => item.label === selectedMainLabel);
    const subOptions = activeMainObject?.children || [];

    const selectStyle = "w-full py-2 rounded-md bg-white/60 text-gray-700 border border-gray-700 focus:ring-1 focus:ring-[#0a2463] focus:border-transparent outline-none transition-all duration-300";
    const labelStyle = "body-reading font-medium text-gray-700 uppercase mb-5 ml-1";

    return (
        <div className="flex flex-col justify-items-center gap-3">
            {/* Product type */}
            <div>
                <label className={labelStyle}>1. Product Type</label>
                <select
                    {...register("category.productType")}
                    className={selectStyle}
                    onChange={(e) => {
                        setValue("category.productType", e.target.value);
                        setValue("category.main", "");
                        setValue("category.subcategory", "");
                    }}
                >
                    <option value="">--Type--</option>
                        {Category_Enum.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                </select>
            </div>

            {/* Main Category */}
            {selectedProductType && (
                <div>
                    <label className={labelStyle}> <span> 2.{selectedProductType}</span></label>
                    <select
                        {...register("category.main")}
                        className={selectStyle}
                        onChange={(e) => {
                            setValue("category.main", e.target.value);
                            setValue("category.subcategory", "")
                        }}
                    >
                        <optgroup label="">
                            <option value="">---Select--</option>
                            {mainOptions.map(item => (
                                <option key={item.label} value={item.label}>{item.label}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>

            )}

            {subOptions.length > 0 && (
                <div>
                    <label className={labelStyle}>3. Specific Genre</label>
                    <select
                        {...register("category.subcategory")}
                        className={selectStyle}>
                        <optgroup label="">
                            <option value="">--Sub-Category</option>
                            {subOptions.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>
            )}
        </div>
    )
}

export default CategorySelector;