import { NavLink } from 'react-router-dom';
import logo from '@/assets/Pukucha_logo-01.png';
import useShop from '@/hooks/useShop.js';
import { motion } from 'framer-motion';
import { ShoppingCart, CircleUser, Search } from "lucide-react";

const categories = [
  { name: 'GENRES', path: '/genres'},
  { name: 'FEATURED', path: '/featured' },
  { name: 'SPECIAL', path: '/special' },
  { name: 'STATIONERY', path: '/stationery' },
  { name: 'RENT', path: '/rent' },
];

export default function DesktopNavBar() {
  const { isProfileDrawerOpen, setIsProfileDrawerOpen, isCartOpen, setIsCartOpen } = useShop();
  const cartCount = 0;

  return (
<div>
    <div className='bar-editorial w-full mx-auto flex justify-evenly gap-[10vw] items-center'>

      {/* LEFT SIDE: Logo */}
      <NavLink to='/'>
        <img src={logo} alt="Bookverse Logo" className="h-9 w-auto" />
      </NavLink>
         
         {/* Middle: Navigation Bar */}
        <div className='flex heading-md gap-[clamp(1.5rem,3vw,4rem)]'>
        {categories.map((cat) => (
          <li key={cat.path} className='list-none'>
            <div className='flex flex-col items-center justify-center gap-0.5'>
              <NavLink 
                to={cat.path} 
                className={({ isActive }) =>
                  isActive
                    ? 'nav-link-active' 
                    : 'nav-link-inactive'
                }
              >
                {cat.name}
              </NavLink>
            </div>
          </li>
        ))}

      </div>


      {/* Right Side: Icons with Toggle Logic */}
      <ul className="flex justify-center items-center gap-[clamp(1rem,2vw,1.5rem)]">
        
        {/* Cart Trigger */}
        <motion.div
          onClick={() => {
            setIsCartOpen(!isCartOpen); // Toggle
            setIsProfileDrawerOpen(false);    // Ensure profile is closed
          }}
          className='flex flex-col items-center gap-0.5 cursor-pointer hover:scale-110'
          whileTap={{ scale: 0.9 }}
        >
          <div className='relative'>
            {/* Icon turns mauve when drawer is open */}
            <ShoppingCart size={24} className={isCartOpen ? 'text-mauve' : 'text-white'} />
            {cartCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-mauve text-white text-[10px] px-1.5 rounded-full'>
                {cartCount}
              </span>
            )}
          </div>

          {isCartOpen && (
            <motion.div
              layoutId='cartUnderline'
              className='border-b-2 border-mauve w-full pt-1'
            />
          )}
        </motion.div>

        {/* Profile Trigger */}
        <motion.div
          onClick={() => {
            setIsProfileDrawerOpen(!isProfileDrawerOpen); // Toggle
            setIsCartOpen(false);              // Ensure cart is closed
          }}
          className='flex flex-col items-center gap-0.5 cursor-pointer hover:scale-110'
          whileTap={{ scale: 0.95 }}
        >
          <CircleUser size={24} className={isProfileDrawerOpen ? 'text-mauve' : 'text-white'} />
          
          {isProfileDrawerOpen && (
            <motion.div
              layoutId='underline'
              className='border-b-2 border-mauve w-full pt-1'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </motion.div>
      </ul>
    </div>
</div>

    
  );
}