// @ts-nocheck
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import useShop from '@/hooks/useShop.js';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, headerHeight, updateCartItems, removeFromCart} = useShop();

    console.log("Current Cart Items:", cartItems);

    useEffect(() => {
        console.log("CartDrawer detected change:", cartItems);
    }, [cartItems]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div key="cart-root">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: .25 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className='fixed inset-0 bg-white/10 backdrop-blur-md z-999'
                        style={{
                            top: `${headerHeight}px`,
                            height: `calc(100vh - ${headerHeight}px)`
                        }}
                    />

                    {/* The Drawer */}
                    <motion.div
                        initial={window.innerWidth < 1024 ? { y: '100%' } : { x: '100%' }}
                        animate={window.innerWidth < 1024 ? { y: 0 } : { x: 0 }}
                        exit={window.innerWidth < 1024 ? { y: '100%' } : { x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`
                            fixed profile-card shadow-xl z-1000 flex flex-col
                            bottom-0 left-0 right-0 w-full rounded-t-4xl h-[85vh]
                            lp:top-0 lp:right-0 lp:left-auto lp:h-screen lp:w-[45vw] dp:w-[30vw] lp:rounded-none
                        `}
                        style={{
                            top: window.innerWidth >= 1024 ? `${headerHeight}px` : 'auto',
                            height: window.innerWidth >= 1024 ? `calc(100vh - ${headerHeight}px)` : '85vh'
                        }}
                    >
                        {/* Header */}
                        <div className='border-b border-gray-100 flex justify-between items-center mb-3 pl-4'>
                            <div className='flex items-center gap-2'>
                                <ShoppingBag size={20} />
                                <h2 className='text-xl font-bold tracking-tight'>Your bag ({cartItems.itemCount})</h2>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className='p-2 hover:bg-gray-100 rounded-full'>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Area */}
                        <div className='flex flex-col gap-5 items-center grow overflow-y-auto px-5 space-y-1'>
                            {cartItems.items?.length > 0 ? (
                                cartItems.items.map((item) => {
                                    if (!item) return null;

                                    return (
                                        <motion.div layout key={item.book._id} className='flex flex-col gap-4 items-start'>
                                        <div className='grid grid-cols-6 items-center'>
                                            <div className='flex items-center justify-center'>
                                               <img src={item.book.bookImage.coverImage} alt={item.book.title} className='w-15 h-auto object-cover rounded-xl bg-gray-200' />
                                            </div>

                                            <h3 className='font-semibold text-navy text-center'>{item.book.title}</h3>
                                            <p className='text-sm text-foreground sub-heading text-center mb-2'>{item.quantity || 'null'}</p>

                                            <div>
                                                <div className='flex justify-center items-center border rounded-2xl'>
                                                    <button
                                                        onClick={() => updateCartItems(item.book._id, item.quantity - 1)}
                                                        className='p-1 hover:text-mauve'><Minus size={14} /></button>
                                                    <span className='px-2 text-sm font-medium'>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateCartItems(item.book._id, item.quantity + 1)}
                                                        className='p-1 hover:text-mauve'><Plus size={14} /></button>
                                                </div>

                                            </div>
                                            <p className='font-bold text-navy text-right pl-4'>NRs. { item.book?.finalPrice ? Math.round(`${item.book.finalPrice * item.quantity}`) : '0.00' }</p>
                                            <div className='flex items-center justify-center h-full'>
                                                <button
                                                    onClick={() => removeFromCart(item.book._id)}
                                                    className='p-2 hover:bg-editorial-red/10 hover:text-editorial-red rounded-full transition-colors group'
                                                    title="Remove item"
                                                >
                                                    <X size={20} className="transition-transform group-hover:scale-110" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                    )
                                }))
                             : (
                                <div className='h-full w-full flex flex-col items-center justify-center text-center space-y-4'>
                                    <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center'>
                                        <ShoppingBag size={32} className='text-gray-300' />
                                    </div>
                                    <p>Your bag is empty.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {
                            <div className='p-2 border-t border-gray-100 bg-gray-50/50'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>SubTotal</span>
                                    <span>{cartItems.bookQuantity}</span>
                                    <span className='text-xl font-bold text-navy'>Nrs {cartItems.subTotal}</span>
                                </div>
                                <button className='w-full bg-foreground text-white py-4 rounded-2xl font-bold'>Checkout Now</button>
                            </div>
                        }
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;