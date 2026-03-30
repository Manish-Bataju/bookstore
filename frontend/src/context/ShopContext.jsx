import { createContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

export const InternalShopContext = createContext();

const ShopProvider = ({ children }) => {
    // connecting front end with backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [activeAdminForm, setActiveAdminForm] = useState();

    //1. Drawer States
    const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    //2. User & Order States
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);  //. when null, user is a guest.
    const [cartItems, setCartItems] = useState([]);

    //3. Header Height Tracking
    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef(null);

    //get books data
    const [books, setBooks] = useState([]);
    const [editBook, setEditBook] = useState(null);
    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState(localStorage.getItem('token') || '');

    // token stored from the localStorage
    useEffect(() => {
        const token = localStorage.getItem('bookstore_token');
        if (token) {
            setToken(token)
        }
    }, []);

    //fetching overAll books data
    const getBooksData = useCallback(async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/book`);

            if (response.data.success) {
                setBooks(response.data.data);
            } else {
                console.log("4. ⚠️ Server said success: false", response.data); // LOG 4
            }
        } catch (error) {
            console.error("❌ Connection to Bookverse failed:", error.message)
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);

    // fetch Orders for the User
    const [myOrders, setMyOrders] = useState([]);

    const getUserCart = useCallback(async (token) => {
        if (!token) return;

        try {
            const responseData = await axios.get(`${backendUrl}/api/cart/`, { headers: { Authorization: `Bearer ${token}` } })
            setCartItems(responseData.data);

        } catch (error) {
            console.error("❌ Connection to Bookverse failed:", error.message)
        }
    }, [backendUrl]);

    useEffect(() => {
        if (token)
            getUserCart(token)
    }, [getUserCart, token])

    //fetching cartItems for the user
    const addToCart = async (bookId) => {

        if (!token) return toast.error("Please log in to add items to your cart.");


        try {
            const responseData = await axios.post(`${backendUrl}/api/cart/add`, { bookId }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log(responseData.data)

            if (responseData.data?._id || responseData.data?.items) {

                console.log(responseData.data)
                await getUserCart(token);
                setIsCartOpen(true);
                toast.success("Book added to Cart");

                setTimeout(() => {
                    setIsCartOpen(false);
                }, 1200);

                // Refresh cart items after adding to cart
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add book to cart. Please try again.");
        }
    }

    // fetch the order for the user
    const fetchMyOrders = useCallback(async () => {
        if (!token) return;

        try {
            const { data } = await axios.get(`${backendUrl}/api/order/myOrder`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // unpack the order from the backend response
            if (data.orders) {
                setMyOrders(data.orders);
            }

        } catch (error) {
            console.error("Library Retrieval Error:", error);
        }
    }, [backendUrl, token]);

    // auto fetch when the token is made available
    useEffect(() => {
        if (token) {
            fetchMyOrders();
        }
    }, [token, fetchMyOrders]);

    //Effect to measure the header whenever the window resizes
    useEffect(() => {

        const handleResize = () => {
            if (headerRef.current) {
                const height = headerRef.current.offsetHeight;
                console.log("📏 Header Height:", height); // Watch this in your console!
                setHeaderHeight(height);
            }
        };

        // 1. Create an observer to watch the header specifically
        const observer = new ResizeObserver(() => {
            handleResize();
        });

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        // 2. Initial trigger
        handleResize();

        // 3. Cleanup
        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        getBooksData();
    }, [getBooksData])

    //login function 
    const login = async (userData) => {
    // 1. Update State
    setUser(userData);
    setToken(userData.token);

    // 2. Persist (Make sure the key matches your LoginForm!)
    localStorage.setItem('bookstore_token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));


    await getUserCart(userData.token); 
    
    // 4. Optional: Open the drawer automatically
    setIsCartOpen(true); 
};

    //log out function that clears the token, user and cart data
    const logOut = () => {
        localStorage.removeItem('bookstore_token');
        setUser(null);
        setToken('');

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // settingCart Empty
        setCartItems([]);
        setIsCartOpen(false);
        toast.success("Logged out successfully");
    };

    //cart update function..
    const updateCartItems = async (bookId, newQuantity) => {
        if(newQuantity < 1) return;

        try {
           const { data } = await axios.patch(`${backendUrl}/api/cart/update-quantity`, { bookId, quantity: newQuantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if(data.success){
                setCartItems
                toast.success("Cart updated successfully");
            }

            await getUserCart(token); // Refresh cart items after update
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    }

    //cart remove function  
    const removeFromCart = async (bookId) => {
        if(!bookId) return;

        try {
            const token = localStorage.getItem('bookstore_token');

            
            const data = await axios.delete(`${backendUrl}/api/cart/remove/${bookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Remove from Cart Response:", data.data);

            if(data.data.success){
                setCartItems(data.data);
                toast.success("Item removed from cart");
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    
    
    }

    //edit form function
    const bookEditingForm = (book) => {
        setEditBook(book);
        setActiveAdminForm("edit");
    }

    const value = {
        isProfileDrawerOpen, setIsProfileDrawerOpen,
        isCartOpen, setIsCartOpen,
        user, setUser,
        cartItems, setCartItems,
        headerHeight,   //Now available to all Drawers
        headerRef,
        backendUrl,
        books, setBooks, loading, getBooksData,
        myOrders, fetchMyOrders,
        token, setToken, login, logOut,
        setActiveAdminForm, activeAdminForm,
        addToCart, updateCartItems, removeFromCart,
        bookEditingForm
    }
    return (
        <InternalShopContext.Provider value={value}>
            {children}
        </InternalShopContext.Provider>
    );
};

export default ShopProvider;