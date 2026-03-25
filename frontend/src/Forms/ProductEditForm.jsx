import { useForm, useWatch } from "react-hook-form";
import { Category_Config } from "@/data/CategoryConfig.js";
// import { useEffect } from "react";
import CategorySelector from "@/Components/CategorySelector.jsx";
import TagSelector from "@/components/TagSelector.jsx";
import ImageUploader from "@/components/ImageUploader.jsx";
import { Rental_Tags } from "../../../Shared/enums.js";
import useShop from "@/hooks/useShop.js";
import { useEffect } from "react";
import axios from "axios";
// import { useParams } from "react-router-dom";

// 2. MAIN FORM COMPONENT
const ProductEditForm = ({ id }) => {
  //getting Id from the url
  const { books, backendUrl } = useShop();

  const selectedBook = books.find(b => b._id === id);
  console.log(selectedBook);

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: selectedBook?.title || '',
      description: selectedBook?.description || '',
      author: selectedBook?.author || '',
      stockHistory:[{
        unitCost: selectedBook?.price || 0
      }],
      bookImage: {
        coverImage: selectedBook?.bookImage?.coverImage || null,
        gallery: selectedBook?.bookImage?.gallery || []
      },
      margin: selectedBook?.margin || 0,
      discountType: selectedBook?.discountType || 'None',
      discountAmount: selectedBook?.discountAmount || 0,
      isForRent: selectedBook?.isForRent || false,
      rentalPrice: selectedBook?.rentalPrice || 0,
    }
  });

  const isForRent = useWatch({ control, name: "isForRent" });

  // const discountType = useWatch({ control, name: "discount.discountType" });
  const history = useWatch({ control, name: "stockHistory" });
  const firstUnitCost = history?.[0]?.unitCost;

  useEffect(() => {
    const previousPrice = selectedBook?.stockHistory?.[0]?.unitCost?.price;

    if(previousPrice !== undefined){
      setValue("stockHistory.0.unitCost", previousPrice);
    }
    }, [selectedBook, setValue]);


  const onSubmit = (data) => {

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if(typeof data[key] !== 'object'){
        formData.append(key, data[key]);
      }
    });

    if(data.bookImage?.coverImage instanceof File){
      formData.append("coverImage", data.bookImage.coverImage);
    }

    axios.post(`${backendUrl}/api/book/updateBook`, formData);
    console.log("Form Data:", formData);
  };

  return (
    <div className="max-tls:hidden w-[35vw] border-2 rounded-lg px-8 py-5 bg-white shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Add a Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">

        <div className="flex flex-col gap-5" >
          {/* Title */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <label className="label-editorial text-[18px]">Title </label>

              {/* The Trigger: Just a label for the eyes, no click action */}
              <div className="group relative flex-none w-auto">
                <span className="label-editorial-hover cursor-pointer"> Prev. Price </span>
                {/* THE REFERENCE TOOLTIP (Shows on Hover) */}
                <div className="absolute right-0 w-75 mb-3 p-2 bg-gray-700 text-white text-[14px] rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 border border-white/10">
                  <p className="text-secondary font-semibold uppercase tracking-normal mb-2 border-b-2 border-white/20 pb-1">
                    Previous Price :
                  </p>
                  {/* This displays the data sitting in your 'selectedBook' state */}
                  <p className="leading-tight text-gray-300 italic">
                    "{selectedBook?.price || "No previous price Found"}"
                  </p>


                </div>
              </div>
            </div>

            <input
              {...register('title', {
                required: "Required",
                minLength: { value: 10, message: "Title has to be minimum 10 Characters Long" }
              })}
              className="border body-reading pl-2 rounded-md w-full focus:ring-1 focus:ring-[#0a2463]"
              placeholder="Book Title"
            />
            {errors.title && <span className="text-red-500 font-md text-sm">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">

            <div className="flex justify-between">
              <label htmlFor="description" className="label-editorial text-[18px]"> Description </label>

              {/* The Trigger: Just a label for the eyes, no click action */}
              <div className="group relative flex-none w-auto">
                <span className="label-editorial-hover cursor-pointer"> Prev. Description </span>
                {/* THE REFERENCE TOOLTIP (Shows on Hover) */}
                <div className="absolute right-0 w-75 mb-3 p-2 bg-gray-700 text-white text-[14px] rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 border border-white/10">
                  <p className="text-secondary font-semibold uppercase tracking-normal mb-2 border-b-2 border-white/20 pb-1">
                    Previous Description :
                  </p>
                  {/* This displays the data sitting in your 'selectedBook' state */}
                  <p className="leading-tight text-gray-300 italic">
                    "{selectedBook?.description || "No previous description Found"}"
                  </p>


                </div>
              </div>
            </div>

            <textarea
              id="description"
              {...register("description", { required: "Required", minLength: { value: 35, message: "Minimum 35 Characters long" } })}
              className="border body-reading rounded-md h-24 focus:ring-1 focus:ring-[#0a2463]"
            />

            {errors.description && <span className="text-red-500 text-sm font-md">{errors.description.message}</span>}
          </div>

          {/* Price & Margin */}
          <div className=" flex flex-col gap-3 border p-3 rounded-md bg-gray-50">

            {/* Price & Discount Section */}
            <div className="flex justify-between gap-4 items-center ">
              {/* Margin section */}
              <div className="flex flex-col grow">

                {/* label Section */}
                <div className="flex justify-between items-center">
                  <label htmlFor="margin" className="label-editorial">Profit Margin</label>

                  {/* The Trigger: Just a label for the eyes, no click action */}
                  <div className="group relative flex-none w-auto">

                    <span className="label-editorial-hover cursor-pointer"> Prev. Margin </span>
                    {/* THE REFERENCE TOOLTIP (Shows on Hover) */}
                    <div className="absolute right-0 w-75 mb-3 p-2 bg-gray-700 text-white text-[14px] rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 border border-white/10">
                      <p className="text-secondary font-semibold uppercase tracking-normal mb-1 border-b-2 border-white/20 pb-1">
                        Previous Price :
                      </p>
                      {/* This displays the data sitting in your 'selectedBook' state */}
                      <p className="leading-tight text-gray-300 italic">
                        "{selectedBook?.margin || "No previous margin Found"}"
                      </p>


                    </div>
                  </div>
                </div>

                <input
                  id="margin"
                  type="number"
                  {...register("margin", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Margin can not be negative" }
                  })}
                  className="border focus:ring-1 focus:ring-[#0a2463] p-1 rounded"
                  onWheel={(e) => e.target.blur()}
                />

                {errors.margin && <span className="text-red-500 text-sm font-md ">{errors.margin.message}</span>}
              </div>

              {/* UnitCost */}
              <div className="flex flex-col">
                <label htmlFor="Unit Cost" className="label-editorial">Unit Cost</label>
                <input
                  id="unitCost"
                  type="number"
                  readOnly //prevents user from typing the price.
                  {...register("stockHistory.0.unitCost", {
                    valueAsNumber: true})}
                  className="border focus:ring-1 focus:ring-[#0a2463] p-1 rounded"
                  onWheel={(e) => e.target.blur()}
                />

                {errors.stockHistory?.[0]?.unitCost && <span className="text-red-500 text-sm font-md ">{errors.stockHistory[0].unitCost.message}</span>}
              </div>
            </div>

            {/* Discount Group */}
            <div className="flex justify justify-between gap-4">
              {/* Discount Type */}
              <div className="flex flex-col grow gap-1">
                <label htmlFor="discountType" className="label-editorial">Discount Type</label>
                <select
                  id="discountType"
                  {...register("discountType")}
                  className="border focus:ring-1 focus:ring-[#0a2463] p-1 rounded">
                  <option value="None">None</option>
                  <option value="Percentage">Percentage %</option>
                  <option value="Flat">Flat Amount</option>
                </select>
              </div>

              {/* Discount Amount */}
              <div className="flex flex-col grow gap-1">

                  {/* label Section */}
                <div className="flex justify-between items-center">
                    <label htmlFor="discountAmount" className="label-editorial">Discount Amount</label>
                    
                     {/* The Trigger: Just a label for the eyes, no click action */}
                  <div className="group relative flex-none w-auto">

                    <span className="label-editorial-hover cursor-pointer"> Prev. Dis-Amount </span>
                    {/* THE REFERENCE TOOLTIP (Shows on Hover) */}
                    <div className="absolute right-0 w-75 mb-3 p-2 bg-gray-700 text-white text-[14px] rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 border border-white/10">
                      <p className="text-secondary font-semibold uppercase tracking-normal mb-1 border-b-2 border-white/20 pb-1">
                        Previous Price :
                      </p>
                      {/* This displays the data sitting in your 'selectedBook' state */}
                      <p className="leading-tight text-gray-300 italic">
                        "{selectedBook?.discountAmount || "No previous discount amount Found"}"
                      </p>


                    </div>
                  </div>
                </div>
                
                <input
                  id="discountAmount"
                  type="number"
                  {...register("discountAmount", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Amount can not be negative" }
                  })}
                  className="border focus:ring-1 focus:ring-[#0a2463] p-1 rounded"
                  onWheel={(e) => e.target.blur()}
                />

                {errors.discountAmount && <span className="text-red-500 text-sm font-md ">{errors.discountAmount.message}</span>}
              </div>
            </div>
          </div>

          {/* Rental Status */}
          <div className="flex items-center gap-5">
            <div>
              <p className="body-reading text-[14px] text-gray-500 italic">Check if this book is available for rent</p>
              <input
                type="checkbox"
                {...register("isForRent")}
                className="w-5 h-5 accent-[#0a2463] cursor-pointer"
              />
            </div>

            {isForRent && (
              <div>
                {/* Rental Price */}
                <div className="relative mb-4 flex grow items-center gap-5">
                  <div>
                      <label className="body-heading font-bold text-gray-700">RENTAL (Rs.)</label>

                         {/* The Trigger: Just a label for the eyes, no click action */}
                  <div className="group relative flex-none w-auto">

                    <span className="label-editorial-hover cursor-pointer"> Prv. Rental</span>
                    {/* THE REFERENCE TOOLTIP (Shows on Hover) */}
                    <div className="absolute right-0 w-75 mb-3 p-2 bg-gray-700 text-white text-[14px] rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 border border-white/10">
                      <p className="text-secondary font-semibold uppercase tracking-normal mb-1 border-b-2 border-white/20 pb-1">
                        Previous Price :
                      </p>
                      {/* This displays the data sitting in your 'selectedBook' state */}
                      <p className="leading-tight text-gray-300 italic">
                        "{selectedBook?.rentalPrice || "No previous rental price Found"}"
                      </p>


                    </div>
                  </div>
                  </div>
                  
                  <input
                    type="number"
                    {...register("rentalPrice", {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Price Min 1"
                      }
                    })}
                    className="border p-1 rounded-md focus:ring-1 focus:ring-[#0a2463] outline-none text-sm"
                    placeholder="0.00"
                  />
                  {errors.rentalPrice && <span className="absolute -bottom-6 left-42 text-[14px] text-red-500 font-md">{errors.rentalPrice.message} </span>}
                </div>

              </div>
            )}
          </div>

          {/* Image upload section */}
          <ImageUploader setValue={setValue} useWatch={useWatch} control={control} />

          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-green-700 shadow-lg"
          >
            Submit Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditForm;