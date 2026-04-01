import { useForm, useWatch } from "react-hook-form";
import { Category_Config } from "@/data/CategoryConfig.js";
import { useEffect } from "react";
import CategorySelector from "@/components/CategorySelector.jsx";
import TagSelector from "@/components/TagSelector.jsx";
import ImageUploader from "@/components/ImageUploader.jsx";
import { Rental_Tags } from "../../../Shared/enums.js";
import axios from "axios";
import useShop from "@/hooks/useShop.js";
import { toast } from "sonner";
import { X } from "lucide-react";

// 2. MAIN FORM COMPONENT
const ProductForm = () => {
  const { register, control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: 'Enter book title',
      description: '',
      author: '',
      category: {
        productType: '',
        main: '',
        subcategory: ''
      },
      tags: ['Best Seller'],
      edition: 0,
      isbnNo: '',
      bookImage: {
        coverImage: null,
        gallery: []
      },
      thumbnailPreview: '',
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

  const { setActiveAdminForm, backendUrl, setBooks } = useShop();
  const currentTags = useWatch({ control, name: "tags" }) || [];
  const isForRent = useWatch({ control, name: "isForRent" })
  // const discountType = useWatch({ control, name: "discount.discountType" });
  const history = useWatch({ control, name: "stockHistory" });
  const firstUnitCost = history?.[0]?.unitCost;


  useEffect(() => {
    if (isForRent) {
      setValue("rentalStatus", Rental_Tags.Status[0]);
    } else {
      setValue("rentalStatus", Rental_Tags.Status[3]);
      setValue("rentalPrice", 0);
    }
  }, [isForRent, setValue]);


  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // 1. HAND-PICK THE FILES (Matches your upload.fields names exactly)
      if (data.bookImage?.coverImage) {
        formData.append("coverImage", data.bookImage.coverImage);
      }

      if (data.bookImage?.gallery?.length > 0) {
        data.bookImage.gallery.forEach((file) => {
          formData.append("gallery", file); // Sending multiple files under one key name
        });
      }

      // 2. APPEND EVERYTHING ELSE (But skip the keys we just handled)
      Object.keys(data).forEach((key) => {
        // EXCLUDE bookImage and thumbnailPreview (blobs/files Multer hasn't invited)
        if (key === "bookImage" || key === "thumbnailPreview") return;

        const value = data[key];

        if (typeof value === "object" && value !== null) {
          // Stringify complex objects like bookDimension or category
          formData.append(key, JSON.stringify(value));
        } else {
          // Simple strings/numbers like title, author, costPrice
          formData.append(key, value);
        }
      });

      // THE API call
      //first Step bis get the token from the localStorage 
      const token = localStorage.getItem("bookstore_token");

      const response = await axios.post(`${backendUrl}/api/book/add`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.status === 201 || response.status === 200) {
        const newBook = response.data.savedBook;
        console.log("Full Server Response:", response.data);

        toast.success(`📚 "${newBook.title}" successfully added!`);
        setBooks(prevBooks => [newBook, ...prevBooks]);

        //clear the form and allow to add another book
        reset();
      }

    } catch (error) {
      console.error("❌ Submission Error:", error)
    }
  };

  return (
    <div className="max-tls:hidden w-[35vw] border-2 rounded-lg px-8 py-5 bg-white shadow-xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center mb-6">Add a Product</h1>

        <button
          onClick={() => setActiveAdminForm(null)} // This is your close function!
          className="top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:text-white hover:bg-red-500 shadow-sm"
          type="button"
        >
          <X size={20} />
        </button>
      </div>




      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        <div className="flex flex-col gap-3" >
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="label-editorial">Title
              <input
                {...register('title', {
                  required: "Required",
                  maxLength: { value: 25, message: "Title has to be maximum 25 Characters Long" }
                })}
                className="border body-reading pl-2 rounded-md w-full focus:ring-1 focus:ring-[#0a2463]"
                placeholder="Book Title"
              />
            </label>
            {errors.title && <span className="text-red-500 font-md text-sm">{errors.title.message}</span>}
          </div>
          {/* Author Input */}
          <div className="flex flex-col gap-1">
            <label className="label-editorial">Author
              <input
                {...register('author', { required: "Author is required" })}
                className="border body-reading pl-2 rounded-md w-full focus:ring-1 focus:ring-[#0a2463]"
                placeholder="e.g. Elias Thorne"
              />
            </label>
            {errors.author && <span className="text-red-500 text-sm">{errors.author.message}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="label-editorial"> Description </label>
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
          <div className=" flex flex-col w-full gap-3 border p-3 rounded-md bg-gray-50">
            {/* Price & Discount Section */}
            <div className="flex justify-between ">
              {/* Margin section */}
              <div className="flex flex-col gap-1">
                <label htmlFor="margin" className="label-editorial">Profit Margin</label>
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
                <label htmlFor="unitCost" className="label-editorial">Unit Cost</label>
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

              {/* CostPrice */}
              <div className="flex flex-col gap-1">
                <label htmlFor="Cost Price" className="label-editorial">Cost Price</label>
                <input
                  id="costPrice"
                  type="number"
                  {...register("costPrice", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Cost can not be negative" }
                  })}
                  className="border focus:ring-1 focus:ring-[#0a2463] p-1 rounded"
                  onWheel={(e) => e.target.blur()}
                />

                {errors.costPrice && <span className="text-red-500 text-sm font-md ">{errors.costPrice.message}</span>}
              </div>
            </div>



            <div className="flex justify-between gap-1">
              {/* quantityReceived */}
              <div className="flex flex-col">
                <label htmlFor="quantityReceived" className="label-editorial">Quantity Received</label>
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

              {/* Discount Group */}
              {/* Discount Type */}
              <div className="flex flex-col">
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
              <div className="flex flex-col ">
                <label htmlFor="discountAmount" className="label-editorial">Discount Amount</label>
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
            <div className="relative">
              <label htmlFor="edition" className="label-editorial">Edition</label>
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
              {errors.edition && (
                <span className="absolute -bottom-6 left-0 text-red-500 font-md text-sm">
                  {errors.edition.message}
                </span>
              )}
            </div>

            {/* ISBN No */}
            <div className="relative">
              <label htmlFor="isbnNo" className="label-editorial">ISBN No</label>
              <input
                type="text"
                id="isbnNo"
                {...register("isbnNo", {
                  minLength: { value: 10, message: "ISBN must be at least 10 digits" },
                  maxLength: { value: 13, message: "ISBN cannot exceed 13 digits" },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "ISBN must contain only numbers"
                  }
                })}
                className="border body-reading pl-2 rounded-sm w-full focus:ring-1 focus:ring-[#0a2463]"
                placeholder="e.g. 9781234567890"
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
                  <label className="label-editorial">RENTAL PRICE(Rs.)</label>
                  <input
                    type="number"
                    {...register("rentalPrice", {
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

          {/* Book Dimension defined */}
          <div className="flex gap-10 border px-3 pt-2 pb-4 rounded-lg bg-gray-50/50">
            {/* Row 1: Dimensions */}
            <div className="flex flex-col items-start">
              <span className="label-editorial">
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
                      min: {
                        value: 0,
                        message: "Min 0"
                      },
                      max: {
                        value: 50,
                        message: "Max 50cm"
                      }
                    })}
                    className="border border-gray-300 pl-2 rounded-md w-20 h-8 text-sm outline-none focus:ring-1 focus:ring-[#0a2463]"
                    placeholder="0.00"
                  />
                  {errors.bookDimension?.height && <span className=" absolute -bottom-4 left-0 text-red-500 font-md text-[14px]">{errors.bookDimension.height.message}</span>}
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
                      min: {
                        value: 0,
                        message: "Min 0"
                      },
                      max: {
                        value: 50,
                        message: "Max 50cm"
                      }
                    })}
                    className="border border-gray-300 pl-2 rounded-md w-20 h-8 text-sm outline-none focus:ring-1 focus:ring-[#0a2463]"
                    placeholder="0.00"
                  />
                  {errors.bookDimension?.width && <span className="absolute -bottom-4 left-0 text-[14px] text-red-500 font-md ">{errors.bookDimension.width.message}</span>}
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
                      min: {
                        value: 0,
                        message: "Min 0"
                      },
                      max: {
                        value: 30,
                        message: "Max 30cm"
                      }
                    })}
                    className="border border-gray-300 pl-2 rounded-md w-20 h-8 text-sm outline-none focus:ring-1 focus:ring-[#0a2463]"
                    placeholder="0.00"
                  />
                  {errors.bookDimension?.thickness && <span className="absolute -bottom-4 left-0 text-[14px] text-red-500 font-md text-sm">{errors.bookDimension.thickness.message}</span>}
                </div>
              </div>
            </div>

            {/* Row 2: Weight */}
            <div className="flex flex-col items-start gap-1">
              <label htmlFor="bookWeight" className="label-editorial">
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
                      message: "Min Weight 1"
                    },
                    max: {
                      value: 1000,
                      message: "Max 1Kg"
                    }
                  })}
                  className="border border-gray-300 pl-2 rounded-md w-24 h-8 text-sm outline-none focus:ring-1 focus:ring-[#0a2463]"
                  placeholder="0.00"
                />
                {errors.bookDimension?.weight && <span className="absolute -bottom-2.5 text-[14px] text-red-500 font-md text-sm">{errors.bookDimension.weight.message}</span>}
              </div>
            </div>
          </div>

          {/* Tags Mapped Section */}
          <section>
            <p className="label-editorial">Tags </p>
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