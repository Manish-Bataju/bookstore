import { useContext } from "react";
import { InternalShopContext } from '@/context/ShopContext.jsx'; // Pointing to the file above

const useShop = () => {
    const context = useContext(InternalShopContext);
    if (!context) {
        throw new Error("useShop must be used within a ShopProvider");
    }
    return context;
};

export default useShop;