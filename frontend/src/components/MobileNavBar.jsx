import { NavLink } from 'react-router-dom';
import { CircleUser, Home, ShoppingCart, Store } from 'lucide-react';
import useShop from '@/hooks/useShop'; // 1. Import your context hook

const categories = [
  { id: 1, label: 'HOME', categoryIcon: Home, path: '/' },
  { id: 2, label: 'STORE', categoryIcon: Store, path: '/shop' },
  { id: 4, label: 'CART', categoryIcon: ShoppingCart, isDrawer: true }, // Added flag
  { id: 3, label: 'PROFILE', categoryIcon: CircleUser, isDrawer: true } // Added flag
];

const MobileNavBar = () => {
  const { setIsCartOpen, setIsProfileDrawerOpen, isCartOpen, isProfileDrawerOpen } = useShop(); // 2. Get setters and state

  return (
    <nav className="bar-bottom-glass"> {/* Increased z-index to stay above drawers */}
      <ul className='bg-w-full w-[90vw] border-white flex justify-between items-center mx-auto shadow-2xl'>
        {categories.map(({ id, label, categoryIcon, path, isDrawer }) => {
          const Icon = categoryIcon;

          // Check if this specific item's drawer is currently open to show the active style
          const isActiveDrawer = (label === 'CART' && isCartOpen) || (label === 'PROFILE' && isProfileDrawerOpen);

          const activeClass = 'font-semibold text-yellow-500 scale-101';
          const inactiveClass = 'text-white text-[14px] font-base tracking-wider ';

          const iconSize = "25px";

          return (
            <li key={id}>
              <div className='flex flex-col justify-center items-center'>

                <div>
                  {isDrawer ? (
                    /* 3. Render a BUTTON for Drawers */

                    <button
                      onClick={() => {
                        if (label === 'CART') {
                          // If already open, close it. If closed, open it.
                          setIsCartOpen(!isCartOpen);
                          setIsProfileDrawerOpen(false); // Close profile if we're opening cart
                        } else {
                          setIsProfileDrawerOpen(!isProfileDrawerOpen);
                          setIsCartOpen(false); // Close cart if we're opening profile
                        }
                      }}
                      className={`transition-all duration-200 ${isActiveDrawer ? activeClass : inactiveClass}`}
                    >
                      <div className='flex flex-col justify-center items-center'>
                        <Icon size={iconSize} />
                        <span className={`transition-all duration-200 ${isActiveDrawer ? activeClass : inactiveClass}`}>{label}</span>
                      </div>
                    </button>
                  ) : (
                    /* 4. Render a NavLink for Pages */
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        `transition-all duration-200 ${isActive ? activeClass : inactiveClass}`
                      }
                    >
                      <div className='flex flex-col items-center justify-center'>
                        <Icon size={iconSize} />
                        <span>{label}</span>
                      </div>

                    </NavLink>
                  )}

                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileNavBar;