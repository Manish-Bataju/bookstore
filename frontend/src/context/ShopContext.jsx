import { createContext, useState, useEffect, useRef , useCallback} from "react";
import axios from "axios";

export const InternalShopContext = createContext();

const ShopProvider =({children})=>{
    // connecting front end with backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    //1. Drawer States
    const[isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    //2. User & Order States
    const [user, setUser] = useState(null);  //. when null, user is a guest.
    const [cartItems, setCartItems] = useState([]);

    //3. Header Height Tracking
    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef(null);

    //get books data
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState("");

        // token stored from the localStorage
    useEffect(() => {
        const token = localStorage.getItem('bookstore_token');
        if(token){
            setToken(token)
        }
      },[]);

         //fetching overAll books data
    const getBooksData = useCallback(async () => {
        try {
        const response = await axios.get(`${backendUrl}/api/book`)
        

        if(response.data.success){
            setBooks(response.data.data); 
        }else {
            console.log("4. ⚠️ Server said success: false", response.data); // LOG 4
        }
        } catch (error) {
            console.error("❌ Connection to Bookverse failed:", error.message)
        }finally{
            setLoading(false);
        }
    }, [backendUrl]);

    // fetch Orders for the User
    const [myOrders, setMyOrders]=useState([]);

    // fetch the order for the user
    const fetchMyOrders = useCallback(async () => {
        if(!token) return;
        
        try {
            const {data} = await axios.get(`${backendUrl}/api/order/myOrder`, {
                headers:{Authorization:`Bearer ${token}`}
            });

            // unpack the order from the backend response
            if(data.orders){
                setMyOrders(data.orders);
            }

        } catch (error) {
           console.error("Library Retrieval Error:", error) ;
        }
    }, [backendUrl, token]);

    // auto fetch when the token is made available
        useEffect(() => {
            if(token){
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
},[]);

useEffect(() => {
    getBooksData();
  }, [getBooksData])

  const logOut = () => {
        localStorage.removeItem('bookstore_token');
        setUser(null);
        setToken('');
  };

const value={
        isProfileDrawerOpen, setIsProfileDrawerOpen,
        isCartOpen, setIsCartOpen,
        user, setUser,
        cartItems, setCartItems,
        headerHeight,   //Now available to all Drawers
        headerRef,
        backendUrl,
        books,loading,getBooksData,
        myOrders,fetchMyOrders,
        token, setToken,
        logOut
}
    return(
    <InternalShopContext.Provider value={value}>
    {children}
    </InternalShopContext.Provider>
    );
};

export default ShopProvider;