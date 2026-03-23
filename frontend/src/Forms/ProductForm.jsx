import { useForm, useWatch } from "react-hook-form";
import { Category_Config } from "@/data/CategoryConfig.js";
import { useEffect } from "react";
import CategorySelector from "@/Components/CategorySelector.jsx";
import TagSelector from "@/components/TagSelector.jsx";
import ImageUploader from "@/components/ImageUploader.jsx";
import { Rental_Tags } from "../../../Shared/enums.js";

// 2. MAIN FORM COMPONENT
const ProductForm = () => {
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: '',
      description: '',
      author: '',
      category: {
        main: '',
        subcategory: ''
      },
      tags: ['Best Seller'],
      edition: 0,
      isbnNo: '',
      bookImage: {
        coverImage:null,
        gallery:[]
      },
      thumbnailPreview:'',
      stockHistory: [
        {
          quantityReceived: 0,
          unitCost: 0
        }
      ],
      margin: 0,
      costPrice: 0,
      discountType: 'None',
      discountAmount: 0,
      isForRent: false,
      rentalPrice: 0,
      bookDimension: {
        height: '',
        width: '',
        thickness: '',
        weight: ''
      }
    }
  });
  const currentTags = useWatch({ control, name: "tags" }) || [];
  const isForRent = useWatch({ control, name: "isForRent" })
  // const discountType = useWatch({ control, name: "discount.discountType" });
  const history = useWatch({ control, name: "stockHistory" });
  const firstUnitCost = history?.[0]?.unitCost;

  useEffect(() => {
    if (firstUnitCost) {
      setValue("costPrice", Number(firstUnitCost))
    }
  }, [firstUnitCost, setValue])

  useEffect(() => {
    if (isForRent) {
      setValue("rentalStatus", Rental_Tags.Status[0]);
    } else {
      setValue("rentalStatus", Rental_Tags.Status[3]);
      setValue("rentalPrice", 0);
    }
  }, [isForRent, setValue]);


  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="max-tls:hidden w-[35vw] border-2 rounded-lg px-8 py-5 bg-white shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Add a Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        <div className="flex flex-col mx-auto gap-3" >
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="body-reading font-medium text-gray-700 uppercase">Title
              <input
                {...register('title', {
                  required: "Required",
                  minLength: { value: 10, message: "Title has to be minimum 10 Characters Long" }
                })}
                className="border body-reading pl-2 rounded-md w-full focus:ring-1 focus:ring-[#0a2463]"
                placeholder="Book Title"
              />
            </label>
            {errors.title && <span className="text-red-500 font-md text-sm">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="body-reading font-medium text-gray-700 uppercase"> Description </label>
            <textarea
              id="description"
              {...register("description", { required: "Required", minLength: { value: 35, message: "Minimum 35 Characters long" } })}
              className="border body-reading rounded-md h-24 focus:ring-1 focus:ring-[#0a2463]"
            />

            {errors.description && <span className="text-red-500 text-sm font-md">{errors.description.message}</span>}
          </div>

          {/* Select Category */}
          <CategorySelector
            register={register}
            setValue={setValue}
            control={control} // Get this from useForm()
          />

          {/* Price & Margin */}
          <div className=" flex flex-col gap-3 border p-3 rounded-md bg-gray-50">
            {/* Price & Discount Section */}
            <div className="flex gap-4 ">
              {/* Margin section */}
              <div className="flex flex-col gap-1">
                <label htmlFor="margin" className="font-bold">Profit Margin</label>
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
              <div className="flex flex-col gap-1">
                <label htmlFor="Unit Cost" className="font-bold">Unit Cost</label>
                <input
                  id="unitCost"
                  type="number"
                  {...register("stockHistory.0.unitCost", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Cost can not be negative" }
                  })}
                  className="border focus:ring-1 focus:ring-[#0a2463] p-1 rounded"
                  onWheel={(e) => e.target.blur()}
                />

                {errors.stockHistory?.[0]?.unitCost && <span className="text-red-500 text-sm font-md ">{errors.stockHistory[0].unitCost.message}</span>}
              </div>

              {/* quantityReceived */}
              <div className="flex flex-col gap-1">
                <label htmlFor="quantityReceived" className="font-bold">Quantity Received</label>
                <input
                  id="quantityReceived"
                  type="number"
                  {...register("stockHistory.0.quantityReceived", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Quantity can not be negative" }
                  })}
                  className="border focus:ring-1 focus:ring-[#0a2463] p-1 rounded"
                  onWheel={(e) => e.target.blur()}
                />

                {errors.stockHistory?.[0]?.quantityReceived && <span className="text-red-500 text-sm font-md ">{errors.stockHistory[0].quantityReceived.message}</span>}
              </div>
            </div>
                
                {/* Discount Group */}
            <div className="flex justify justify-between gap-4">
              {/* Discount Type */}
              <div className="flex flex-col grow gap-1">
                <label htmlFor="discountType" className="font-bold">Discount Type</label>
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
                <label htmlFor="discountAmount" className="font-bold">Discount Amount</label>
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

          {/* edition and ISBN No */}
          <div className="relative flex justify-between gap-3">
            <div>
              <label htmlFor="edition">Edition</label>
              <input
                type="number"
                id="edition"
                {...register("edition", {
                  valueAsNumber: true,
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "In numbers only"
                  }
                })}
                className="border body-reading pl-2 rounded-sm w-full focus:ring-1 focus:ring-[#0a2463]"
                placeholder="e.g. 1"
              />
              {errors.edition && <span className="text-red-500 font-md text-sm">{errors.edition.message}</span>}
            </div>

            {/* ISBN No */}
            <div className="relative">
              <label htmlFor="isbnNo">ISBN No</label>
              <input
                type="number"
                id="isbnNo"
                {...register("isbnNo", {
                  valueAsNumber: true,
                  min: { value: 1000000000, message: "ISBN must be at least 10 digits" },
                  max: { value: 9999999999999, message: "ISBN cannot exceed 13 digits" }
                })}
                className="border body-reading pl-2 rounded-sm w-full focus:ring-1 focus:ring-[#0a2463]"
                placeholder="e.g. 1"
              />
              {errors.isbnNo && <span className="absolute -bottom-6 left-0 text-[14px] text-red-500 font-md">{errors.isbnNo.message}</span>}
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
                  <label className="body-heading font-bold text-gray-700">RENTAL PRICE (Rs.)</label>
                  <input
                    type="number"
                    {...register("rentalPrice", {
                      min: {
                        value: 0,
                        message: "Price Min 1"} })}
                    className="border p-1 rounded-md focus:ring-1 focus:ring-[#0a2463] outline-none text-sm"
                    placeholder="0.00"
                  />
                  {errors.rentalPrice  && <span className="absolute -bottom-6 left-42 text-[14px] text-red-500 font-md">{errors.rentalPrice.message} </span>}
                </div>

              </div>
            )}
          </div>

          {/* Book Dimension defined */}
          <div className="flex gap-10 border px-3 pt-2 pb-4 rounded-lg bg-gray-50/50">
            {/* Row 1: Dimensions */}
            <div className="flex flex-col items-start">
              <span className="text-[14px] font-bold text-[#0a2463] uppercase tracking-widest pb-1">
                Dimensions (cm)
              </span>

              <div className="relative flex gap-2 py-2">
                {/* Height */}
                <div className="flex flex-col">
                  <label htmlFor="bookHeight" className="text-[10px] font-bold text-gray-500 uppercase">Height</label>
                  <input
                    type="number"
                    step="0.1"
                    id="bookHeight"
                    {...register("bookDimension.height", {
                      valueAsNumber: true,
                      min:{
                      value: 0,
                      message: "Min 0"},
                      max:{
                      value: 50,
                      message: "Max 50cm"}
                      })}
                    className="border border-gray-300 pl-2 rounded-md w-20 h-8 text-sm outline-none focus:ring-1 focus:ring-[#0a2463]"
                    placeholder="0.00"
                  />
                  {errors.bookDimension?.height && <span className= " absolute -bottom-4 left-0 text-red-500 font-md text-[14px]">{errors.bookDimension.height.message}</span>}
                </div>

                {/* Width */}
                <div className="flex flex-col">
                  <label htmlFor="bookWidth" className="text-[10px] font-bold text-gray-500 uppercase">Width</label>
                  <input
                    type="number"
                    step="0.1"
                    id="bookWidth"
                    {...register("bookDimension.width", {
                      valueAsNumber: true,
                      min:{
                      value: 0,
                      message: "Min 0"},
                      max:{
                      value: 50,
                      message: "Max 50cm"}})}
                    className="border border-gray-300 pl-2 rounded-md w-20 h-8 text-sm outline-none focus:ring-1 focus:ring-[#0a2463]"
                    placeholder="0.00"
                  />
                  {errors.bookDimension?.width && <span className="absolute -bottom-4 left--25 text-[14px] text-red-500 font-md ">{errors.bookDimension.width.message}</span>}
                </div>

                {/* Thickness */}
                <div className="flex flex-col">
                  <label htmlFor="bookThickness" className="text-[10px] font-bold text-gray-500 uppercase">Thickness</label>
                  <input
                    type="number"
                    step="0.1"
                    id="bookThickness"
                    {...register("bookDimension.thickness", {
                      valueAsNumber: true,
                      min:{
                      value: 0,
                      message: "Min 0"},
                      max:{
                      value: 30,
                      message: "Max 30cm"} })}
                    className="border border-gray-300 pl-2 rounded-md w-20 h-8 text-sm outline-none focus:ring-1 focus:ring-[#0a2463]"
                    placeholder="0.00"
                  />
                  {errors.bookDimension?.thickness && <span className="absolute -bottom-4 left--25 text-[14px] text-red-500 font-md text-sm">{errors.bookDimension.thickness.message}</span>}
                </div>
              </div>
            </div>

            {/* Row 2: Weight */}
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="bookWeight" className="text-[14px] font-bold text-[#0a2463] uppercase tracking-widest">
                Total Weight
              </label>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Grams</span>
                <input
                  type="number"
                  id="bookWeight"
                  {...register("bookDimension.weight", {
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Min Weight 1"},
                    max:{
                      value:1000,
                      message: "Max 1Kg"
                    } })}
                  className="border border-gray-300 pl-2 rounded-md w-24 h-8 text-sm outline-none focus:ring-1 focus:ring-[#0a2463]"
                  placeholder="0.00"
                />
                {errors.bookDimension?.weight && <span className="absolute -bottom-2.5 left--25 text-[14px] text-red-500 font-md text-sm">{errors.bookDimension.weight.message}</span>}
              </div>
            </div>
          </div>

          {/* Tags Mapped Section */}
          <section>
            <h3 className="body-reading font-medium text-gray-700 uppercase">Tags </h3>
            {Category_Config.tagGroup.map((tagGroup) => (
              <TagSelector
                key={tagGroup.title}
                title={tagGroup.title}
                categories={tagGroup.values}
                selectedTags={currentTags}
                multiSelect={tagGroup.title === "Marketing"}
                onChange={(updatedGroupTags) => {
                  const otherGroupTags = currentTags.filter(t => !tagGroup.values.includes(t));

                  const finalGroupTags = [...otherGroupTags, ...updatedGroupTags]

                  setValue("tags", finalGroupTags, { shouldDirty: true })
                }
                }
              />
            ))}
          </section>

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

export default ProductForm;