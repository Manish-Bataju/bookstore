// @ts-nocheck
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import useShop from '@/hooks/useShop.js';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, headerHeight } = useShop();

    const total = (cartItems || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
                            lp:top-0 lp:right-0 lp:left-auto lp:h-screen lp:w-85 lp:rounded-none
                        `}
                        style={{
                            top: window.innerWidth >= 1024 ? `${headerHeight}px` : 'auto',
                            height: window.innerWidth >= 1024 ? `calc(100vh - ${headerHeight}px)` : '85vh'
                        }}
                    >
                        {/* Header */}
                        <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <ShoppingBag size={20} />
                                <h2 className='text-xl font-bold tracking-tight'>Your bag ({cartItems.length})</h2>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className='p-2 hover:bg-gray-100 rounded-full'>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Area */}
                        <div className='flex grow overflow-y-auto p-6 space-y-6'>
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <motion.div layout key={item.id} className='flex gap-4 items-start'>
                                        <img src={item.image} alt={item.name} className='w-20 h-24 object-cover rounded-xl bg-gray-200' />
                                        <div className='flex-1'>
                                            <h3 className='font-semibold text-navy'>{item.name}</h3>
                                            <p className='text-sm text-gray-400 mb-2'>{item.size || 'One Size'}</p>
                                            <div className='flex justify-between items-center'>
                                                <div className='flex items-center border rounded-lg'>
                                                    <button className='p-1 hover:text-mauve'><Minus size={14} /></button>
                                                    <span className='px-2 text-sm font-medium'>{item.quantity}</span>
                                                    <button className='p-1 hover:text-mauve'><Plus size={14} /></button>
                                                </div>
                                                <span className='font-bold text-navy'>${item.price}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className='h-full w-full flex flex-col items-center justify-center text-center space-y-4'>
                                    <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center'>
                                        <ShoppingBag size={32} className='text-gray-300' />
                                    </div>
                                    <p>Your bag is empty.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className='p-6 border-t border-gray-100 bg-gray-50/50'>
                                <div className='flex justify-between mb-4'>
                                    <span className='text-gray-500'>SubTotal</span>
                                    <span className='text-xl font-bold text-navy'>${total.toFixed(2)}</span>
                                </div>
                                <button className='w-full bg-navy text-white py-4 rounded-2xl font-bold'>Checkout Now</button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;