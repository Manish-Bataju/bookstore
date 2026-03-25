import Book from "../schema/bookModel.js";

//only admin access to add book
const addBook = async (req, res) => {

  console.log("User Found:", req.user)

  try {
    // --- AUTOMATIC PARSING BLOCK ---
    for (const key in req.body) {
      try {
        if (typeof req.body[key] === 'string' && (req.body[key].startsWith('{') || req.body[key].startsWith('['))) {
          req.body[key] = JSON.parse(req.body[key]);
        }
      } catch (e) { /* Not JSON, skip */ }
    }

    //mapping of Image from multer..
    const coverUrl = req.files?.["coverImage"]?.[0]?.path;
    const galleryUrls = req.files?.["gallery"]?.map((file) => file.path) || [];

    //created a new book instance with details
    const book = new Book({
      ...req.body,
      bookImage: {
        coverImage: coverUrl,
        gallery: galleryUrls,
      },
      seller: req.user._id,
    });

    const savedBook = await book.save();
    res.status(201).json({ success: true, savedBook });
  } catch (error) {
    const statusCode = error.name === "ValidationError" ? 400 : 500;

    console.error("🔥 DATABASE CRASH:", error);
    
    return res.status(statusCode).json({ message: error.message });
  }
};

//get all books by public
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).populate("author", "name email");
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//search book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "author",
      "fullName email shopName -_id",
    );
    if (!book) return res.status(404).json({ message: "Book not found" });

    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update book details admin only
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    // security verification whoever owns the book can edit it :)
    if (book.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit it" });
    }

    //image uploads
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map((file) => file.path);

      req.body.bookImage = {
        coverImage: newImageUrls[0] || book.bookImage.coverImage,
        gallery: [...(book.bookImage.gallery || []), ...newImageUrls.slice(1)],
      };
    }

    //update book fields
    Object.assign(book, req.body);

    //save triggers the pre-save hook to recalculate prices
    const updatedBook = await book.save();

    //populating the data instead of IDS in main and category
    await updatedBook.populate([
      { path: "category.main", select: "name -_id" },
      { path: "category.subcategory", select: "name -_id" },
      { path: "author", select: "fullName -_id" },
    ]);

    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//delete book details admin only
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res
      .status(200)
      .json({ success: true, message: "Book removed from the store" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addBook, getAllBooks, getBookById, updateBook, deleteBook };
