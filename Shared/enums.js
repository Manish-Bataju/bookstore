// shared/enums.js
export const Marketing_Tags = {
  Marketing: [
    "Best Selling",
    "Awarded",
    "Best Seller",
    "New Arrival",
    "Discounted",
    "Limited Edition",
    "Exclusive",
    "Trending",
  ],
};

export const Rental_Tags = {
  Status: [
    "Available for Rent", // Shown on the browse list
    "Currently Rented", // Shown if someone else has it
    "Rent to Own", // A special hybrid marketing tag
    "Not available for Rent",
  ],
};

export const Genres_Enum = [
  {
    label: "Fiction",
    children: [
      "Literary",
      "Historical",
      "Romance",
      "Thriller",
      "Mystery",
      "Horror",
    ],
  },
  {
    label: "Speculative",
    children: ["Fantasy", "Sci-Fi", "Dystopian", "Magical Realism"],
  },
  {
    label: "Non-Fiction",
    children: ["Biography", "History", "Self-Help", "Business", "True Crime"],
  },
  {
    label: "Youth",
    children: ["Young Adult", "Middle Grade", "Picture Books"],
  },
  { label: "Graphic", children: ["Manga", "Graphic Novels", "Comics"] },
];

export const Special_Enum = [
  { label: "Signed Copies", children: [] },
  { label: "First Editions", children: [] },
  { label: "Limited Box Sets", children: [] },
  {
    label: "Local Authors",
    children: ["Nepali Literature", "Regional Writers"],
  },
  { label: "Translated Works", children: [] },
];

export const Featured_Enum = [
  { label: "New Arrivals", children: [] },
  { label: "Best Sellers", children: [] },
  { label: "Award Winners", children: [] },
  { label: "Staff Picks", children: [] },
  { label: "Book-to-Screen", children: [] },
];

export const Stationery_Enum = [
  {
    label: "Reading Accessories",
    children: ["Bookmarks", "Reading Lights", "Book Sleeves"],
  },
  {
    label: "Writing Tools",
    children: ["Premium Pens", "Highlighters", "Fountain Pen Ink"],
  },
  {
    label: "Journals & Notebooks",
    children: ["Hardcover Journals", "Planners", "Sketchbooks"],
  },
  {
    label: "Office Supplies",
    children: ["Sticky Notes", "Desk Organizers", "Washi Tape"],
  },
  {
    label: "Gift Items",
    children: ["Literary Mugs", "Tote Bags", "Greeting Cards"],
  },
];

export const Category_Enum = ["Genres", "Special", "Featured", "Stationery"];
