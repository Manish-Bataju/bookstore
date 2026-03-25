import useShop from '@/hooks/useShop.js';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import LoginForm from '@/Forms/LoginForm.jsx';
import RegisterForm from '@/Forms/RegisterForm.jsx';
import ProductForm from '@/Forms/ProductForm.jsx';
import ProductEditForm from '@/Forms/ProductEditForm.jsx';


const ProfileDrawer = () => {
    const {activeAdminForm, setActiveAdminForm, isProfileDrawerOpen, setIsProfileDrawerOpen, user, headerHeight, myOrders, logOut } = useShop();
    
    const [view, setView] = useState('login')

    const showRegister = () => { setView('register') };

    useEffect(() => {
        if (!isProfileDrawerOpen) {
            const timer = setTimeout(() => {
                setView('login');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isProfileDrawerOpen])

    return (
        <AnimatePresence>
            {isProfileDrawerOpen && (
                <>
                    {/*overlay*/}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: .25 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onClick={() => setIsProfileDrawerOpen(false)}
                        className="fixed inset-0 bg-white/10 backdrop-blur-md z-999"
                    />

                    {/* The Drawer */}
                    <motion.div
                        /* ANIMATION LOGIC: Side on desktop, Up on mobile */
                        initial={window.innerWidth < 1024 ? { y: '100%' } : { x: '100%' }}
                        animate={window.innerWidth < 1024 ? { y: 0 } : { x: 0 }}
                        exit={window.innerWidth < 1024 ? { y: '100%' } : { x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}

                        className={`fixed profile-card shadow-xl z-1000 flex flex-col bg-white/75
                
                /* MOBILE SETTINGS */
                bottom-0 left-0 right-0 max:mls:w-full  mls:w-[50vw] rounded-t-2xl h-[85vh]
                
                /* DESKTOP (lp) SETTINGS */
                lp:top-0 lp:right-0 lp:left-auto lp:h-screen tls:w-95 lp:rounded-none`}
                        style={window.innerWidth >= 1024 ? {
                            top: `${headerHeight}px`,
                            height: `calc(100vh - ${headerHeight}px)`
                        } : {}} // On mobile, we don't need the top:headerHeight offset
                    >

                        <div className='flex flex-col px-4 w-full h-full mt-5'>
                            {/* Header of Drawer */}
                            <div className='flex justify-between items-center mb-10'>

                                <h2 className='text-3xl pb-0.5 border-b-3 font-bold tracking-tight'>
                                    {user ? 'Account' : view === 'login' ? 'Sign In' : 'Join us'}
                                </h2>
                                <button
                                    onClick={() => setIsProfileDrawerOpen(false)}
                                    className='p-2 outline hover:bg-gray-100 rounded-full transition-colors'
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content of the Drawer */}
                            <div className=''>
                                {user ? (
                                    <div className="p-6 flex flex-col h-full bg-white">
                                        <div className="flex items-center gap-4 border-b border-border/30 pb-6 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-serif text-xl">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground tracking-tight">{user.name}</h3>
                                                {/* Using your new username slug here! */}
                                                <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">
                                                    @{user.userName}
                                                </p>
                                            </div>
                                        </div>

                                        <nav className="space-y-4">

                                            {/* Heading changes according to the user role */}
                                            <p> {user.role === 'admin' ? 'Shop sales Activity' : 'My Library Orders' } </p>

                                            <div>
                                                {myOrders.length > 0 ? (
                                                    myOrders.map((item) => (
                                                        <div key={item._id}>
                                                            <p>{item._id.slice(-6).toUpperCase()}</p>
                                                            <p>{new Date(item.createdAt).toLocaleDateString()} </p>
                                                        </div>
                                                    ))
                                                ) : (<p className="font-serif italic text-secondary/50">Your History is empty</p>)}
                                            </div>

                                            {/* Show extra button only for Admins/Shops */}
                                            {user.role === "admin" && (
                                                    <div>
                                                        <p>Admin Tools</p>
                                               
                                                <button
                                                onClick={() => {
                                                    setActiveAdminForm('Add');
                                                    setIsProfileDrawerOpen(false);
                                                  }}
                                                className="btn-editorial ink-forest">
                                                    Add a Book
                                                </button>
                                                <button
                                                onClick={() => {
                                                    setActiveAdminForm('Edit');
                                                    setIsProfileDrawerOpen(false);
                                                  }}
                                                className="btn-editorial ink-forest">
                                                    Edit a Book
                                                </button>
                                                <button
                                                onClick={() => {
                                                    setActiveAdminForm('List');
                                                    setIsProfileDrawerOpen(false);
                                                  }}
                                                className="btn-editorial ink-forest">
                                                    View all books
                                                </button>
                                                </div>
                                            )}
                                        </nav>
                                        <button
                                            onClick={() => {
                                                logOut();
                                                setIsProfileDrawerOpen(false);
                                            }}
                                            className='btn-primary'>Log Out</button>
                                    </div>
                                ) : view === 'login' ? (
                                    // login Form
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <LoginForm onSuccess={() => { setIsProfileDrawerOpen(false) }} />
                                        <div className='flex justify-center'>

                                            {/* register Button when login form is on */}
                                            <button
                                                onClick={showRegister}
                                                className="group mx-auto text-[13px] text-foreground/60 transition-colors hover:text-foreground">
                                                Don't have an account?
                                                <span className="relative font-bold ml-1 text-foreground transition-colors group-hover:text-primary">
                                                    Register
                                                    {/* The Gold Underline: Sharp and visible on light backgrounds */}
                                                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full" />
                                                </span>
                                            </button>
                                        </div>

                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className='space-y-6'>
                                            <RegisterForm onSuccess={() => { setIsProfileDrawerOpen(false) }} />

                                            {/* Login Button when registration view is on */}
                                            <button onClick={() => setView('login')}
                                                className="w-full text-center text-[13px] text-foreground/40 mt-4">
                                                Already a member? <span className="font-bold underline">Login</span>
                                            </button>
                                        </div>
                                    </motion.div>

                                )}
                            </div>

                            {/* Footer of the Drawer */}
                            <div className='pt-6 border-t body-reading-sm text-black'>
                                <p>2026 Bookverse- A Book Store <br />
                                    All rights reserved</p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileDrawer;