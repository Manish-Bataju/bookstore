import { Genres_Enum, Special_Enum, Featured_Enum, Stationery_Enum, Rental_Tags, Marketing_Tags} from "../../../Shared/enums.js";

   // defining size Maps based on schema
export const Category_Map = {
  Genres: Genres_Enum,
  Special: Special_Enum,
  Featured: Featured_Enum,
  Stationery: Stationery_Enum,
};


export const Category_Config = {
  genres: {
    title: "Main Genres",
    values: Genres_Enum // From your Genre List
  },
  special: {
    title: "Special Collections",
    values: Special_Enum
  },
  stationery: {
    title: "Stationery & Tools",
    values: Stationery_Enum
  },
  tagGroup: [
    { title: "Marketing", values: Marketing_Tags.Marketing },
    { title: "Featured", values: Featured_Enum.map(f => f.label) }
  ]
};
