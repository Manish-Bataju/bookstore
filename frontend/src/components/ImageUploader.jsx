import imageResizer from "@/utility/imageResizer.js";
import { useRef, useState } from "react";

export default function ImageUploader({ setValue, useWatch, control }) {
    // 1. Properly watch the form state
    const gallery = useWatch({ control, name: "bookImage.gallery" }) || [];
    const coverImage = useWatch({ control, name: "bookImage.coverImage" });
    const thumbnailPreview = useWatch({ control, name: "thumbnailPreview" });
    const fileInputref = useRef(null);

    const [previews, setPreviews] = useState([]);

    // 2. Adding images to the gallery
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        console.log(files);
        if (files.length === 0) return;

        const newGallery = [...gallery, ...files];
        setValue("bookImage.gallery", newGallery, { shouldDirty: true });

        const newPreviews = files.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newPreviews]);


        // AUTO-SELECT THUMBNAIL: If no thumbnail exists
        if (gallery.length === 0) {
            console.log("First upload detected. Auto-selecting cover:", files[0].name);
            await selectThumbnail(0, files[0]);
        }
    };

    // 3. Independent function to resize and set the thumbnail
    const selectThumbnail = async (fileIndex, manualFile = null) => {
        console.log("selectThumbnail called with index:", fileIndex, "Manual File:", manualFile?.name);
        const selectedFile = manualFile || gallery[fileIndex];
        if (!selectedFile) {
            console.error("No file found for thumbnail selection");
            return;
        }

        try {
            console.log("Processing file through resizer:", selectedFile.name);
            // Resize the selected image for cover
            const result = await imageResizer(selectedFile, 200, 400);
            console.log("Resizer Success! Resulting File:", result.file);

            setValue("bookImage.coverImage", result.file, { shouldDirty: true });
            setValue("thumbnailPreview", result.preview);
            console.log("Form Values updated for bookImage.coverImage");
        } catch (error) {
            console.error("Resizing failed:", error);
        }


    };

    const removeImage = (indexToRemove) => {
        // Revoke the URL to save memory
        URL.revokeObjectURL(previews[indexToRemove]);

        const filteredGallery = gallery.filter((_, index) => index !== indexToRemove);
        const filteredPreviews = previews.filter((_, index) => index !== indexToRemove);

        setValue("bookImage.gallery", filteredGallery, { shouldDirty: true });
        setPreviews(filteredPreviews);

        // If we deleted the active thumbnail, reset it or pick the next available
        if (coverImage?.name === gallery[indexToRemove]?.name) {
            if (filteredGallery.length > 0) {
                selectThumbnail(0); // Auto-pick the new first image
            } else {
                setValue("bookImage.coverImage", null);
                setValue("thumbnailPreview", "");
            }
        }
    };


    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[#0a2463] uppercase tracking-widest block">
                    Upload Gallery & Select Thumbnail
                </label>
                <div className="flex gap-3 items-center">
                    {/* custom button */}
                    <button
                        type="button"
                        onClick={() => fileInputref.current?.click()}
                        className="text-[16px] font-medium bg-[#0a2463] text-white px-3 py-1 rounded-md hover:bg-[#0a2463]/90 transition-all active:scale-95 shadow-sm"
                    >
                        Add Images
                    </button>
                    <div>
                        {gallery.length === 0 ? "No Images Uploaded" : `${gallery.length} ${gallery.length === 1 ? 'Image' : 'Images'} selected`}
                    </div>

                </div>

            </div>



            <input
                ref={fileInputref}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0a2463] file:text-white hover:file:bg-[#0a2463]/90 cursor-pointer"
                accept="image/*"
            />

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">

                {previews.map((src, index) => {
                    // Check if this specific file is the one selected as thumbnail
                    const isThumbnail = coverImage?.name === gallery[index]?.name &&
                        coverImage?.size === gallery[index]?.size;

                    return (
                        <div
                            key={index} className="group relative aspect-3/4">
                            <div
                                onClick={() => selectThumbnail(index)}
                                className={`relative aspect-3/4 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 
                                ${isThumbnail
                                        ? "border-[#0a2463] ring-2 ring-[#0a2463]/20 shadow-lg scale-105"
                                        : "border-transparent opacity-70 hover:opacity-100 hover:border-[#0a2463]/30"
                                    }`}
                            >
                                <img src={src} alt="preview" className="w-full h-full object-cover" />
                                {isThumbnail && (
                                    <div className="absolute top-1 right-1 bg-[#0a2463] text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-bold animate-in fade-in zoom-in">
                                        Primary
                                    </div>
                                )}
                            </div>
                            {/* Delete Button - Appears on Hover */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
                            >
                                <span className="text-[12px] font-bold">✕</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Thumbnail Preview Area */}
            {thumbnailPreview && (
                <div className="mt-4 p-2 bg-[#FFF4E0]/30 rounded-xl border border-[#0a2463]/10 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                    <div className="w-16 h-20 bg-white rounded border border-[#0a2463]/20 overflow-hidden shadow-sm">
                        <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Resized Thumbnail" />
                    </div>
                    <div className="flex items-center gap-6">
                    <div>
                        <p className="text-[11px] font-bold text-[#0a2463] uppercase tracking-tight">Active Thumbnail</p>
                        <p className="text-[10px] text-[#0a2463]/70 italic leading-tight">
                            Dimension-optimized.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => console.log("Final bookImage:", { coverImage, gallery })}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        Verify Cover Image
                    </button>
                    </div>
                    
                </div>
            )}
        </div>
    );
}