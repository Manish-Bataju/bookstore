import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxLength: 25 },
    bookSlug: { type: String, unique: true, trim: true },
    description: { type: String, required: true, trim: true, minLength: 40 },
    author: { type: String, required: true, trim: true },

    category: {
      // This defines if it's a "Genre", "Special", "Featured", or "Stationery"
      productType: {
        type: String,
        required: true,
        enum: ["Genres", "Special", "Featured", "Stationery"],
      },
      // The specific value from your Enums
      main: { type: String, required: true },
      // Optional further detail
      subcategory: { type: String },
    },
    // In bookModel.js (Mongoose)
    tags: {
      type: [String], // This tells Mongoose to expect an Array of Strings
      default: ["Best Seller"],
    },
    brand: { type: String, trim: true },
    edition: { type: String },
    isbnNo: { type: String, unique: true, sparse: true },
    bookImage: {
      coverImage: { type: String }, // The resized 300x400 URL
      gallery: [{ type: String }], // The high-res gallery URLs
    },

    stockHistory: [
      {
        quantityReceived: { type: Number, required: true }, //stock level
        unitCost: { type: Number }, //cost Price of the Book
        batchCost: { type: Number }, //cost of the Batch

        currentStock: { type: Number }, //defines the current stock level
        stockCost: { type: Number, default: 0 },
        receivedAt: { type: Date, default: Date.now }, //date received
      },
    ],
    totalBookLeft: { type: Number, default: 0 },
    totalBookSold: { type: Number, default: 0 },
    totalBookReceived: { type: Number, default: 0 },

    totalStockValue: { type: Number, default: 0 },
    margin: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    sellingBasePrice: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ["Percentage", "Flat", "None"],
      default: "None",
    },

    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },

    // review system
    reviews: [
      {
        userName: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isForRent: { type: Boolean, default: false },
    rentalPrice: { type: Number, default: 0 },

    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    bookWeight: { type: Number, default: 0 },
    bookDimension: {
      length: { type: String },
      thickness: { type: String },
      width: { type: String },
    },
  },
  { timestamps: true },
);

// MiddleWare Functions for slug and quantity and price
bookSchema.pre("save", function () {
  // --- 1. SLUG GENERATION ---
  if (this.isModified("title") || this.isNew) {
    const newTitle = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") //removes any characters that is not a word or spaces inside the word.
      .split(/\s+/g) //splits where it find spaces single or multiple in between the words
      .join("_"); // join these words with underscore between the words to get.

    const newISBN = this.isbnNo
      ? this.isbnNo.toString().slice(-4)
      : Math.floor(1000 + Math.random() * 9000); //takes the first 5 numbers from the ISBN number

    this.bookSlug = `${newTitle}_${newISBN}`;
  }

  // --- 2. STOCK & TOTAL COST CALCULATION ---
  //Only run if stockHistory has changed
  if (this.isModified("stockHistory")) {
    let totalInventoryValue = 0;
    let totalInventoryQuantity = 0;
    let totalBookCalculated = 0;

    this.stockHistory.forEach((shipment) => {
      // Safety: Auto-fill currentStock if it's a new entry
      if (
        shipment.currentStock === undefined ||
        shipment.currentStock === null
      ) {
        shipment.currentStock = shipment.quantityReceived;
      }

      const qty = shipment.quantityReceived || 0;
      const price = shipment.unitCost || 0;
      const stockLevel = shipment.currentStock || 0;

      // Calculate the cost for this specific batch
      shipment.batchValue = qty * price;

      // stockCost = Value of what is left on the shelf
      shipment.stockCost = stockLevel * price;

      // Sum up only the current value for the book's totalStockValue
      totalInventoryValue += shipment.stockCost;
      totalInventoryQuantity += stockLevel;
      totalBookCalculated += qty;
    });

    this.totalStockValue = totalInventoryValue;
    this.totalBookReceived = totalBookCalculated;
    this.totalBookSold = totalBookCalculated - totalInventoryQuantity;
    this.totalBookLeft = totalInventoryQuantity;
  }

  // --- 3. AUTO-GENERATES SELLING PRICE VIA MARGIN ---
  if (this.isModified("costPrice") || this.isModified("margin")) {
    const cost = this.costPrice || 0;
    const marginPercent = this.margin || 0;

    const rawCost = cost + cost * (marginPercent / 100)

    this.sellingBasePrice = Number(rawCost.toFixed(2)) ;
  }

  // --- 4. PRICING & DISCOUNT (Fixing variables & quotes) ---
  if (
    this.isModified("sellingBasePrice") ||
    this.isModified("discountType") ||
    this.isModified("discountAmount")
  ) {
    const base = this.sellingBasePrice || 0;
    const amount = this.discountAmount || 0;
    let rawPrice = 0;

    switch (this.discountType) {
      case "Percentage":
        rawPrice = base - base * (amount / 100);
        break;

      case "Flat":
        rawPrice = base - amount;
        break;

      case "None":
      default:
        rawPrice = base;
        break;
    }
    this.finalPrice = rawPrice < 0 ? 0 : Number(rawPrice.toFixed(2));
  }

  //5. ------- Reviews and Rating Calculator -------

  if (this.isModified("reviews")) {
    this.totalReviews = this.reviews.length;

    if (this.totalReviews > 0) {
      //sum of all ratings
      const totalScore = this.reviews.reduce(
        (acc, item) => acc + item.rating,
        0,
      );

      //calculate average and round to 1 decimal place (e.g: 4.1)
      this.averageRating = Number((totalScore / this.totalReviews).toFixed(1));
    } else {
      this.averageRating = 0;
    }
  }

  //rental status to define here
  // 1. If the user UNCHECKS "isForRent",'Not Available'
  this.rentalStatus = this.isForRent ? "Available for Rent" : "Not Available for Rent";
});

export default mongoose.model("Book", bookSchema);
