import MobileNavBar from './MobileNavBar.jsx';
import DesktopNavBar from './DesktopNavBar.jsx';
import ProfileDrawer from './ProfileDrawer.jsx';
import CartDrawer from './CartDrawer.jsx';
import useShop from '@/hooks/useShop.js';
import AnnouncementBar  from './AnnouncementBar.jsx';


const NavBar = () => {
  const { headerRef } = useShop();
  return (
    <>
    <header ref={headerRef} className="sticky top-0 w-full z-1001">
    <AnnouncementBar/>

    {/* {1. Mobile: Show only on small/Medium Screens} */}
    <div className='lp:hidden'>
        <MobileNavBar/>
    </div>
    {/* 2. Desktop: Show only on large screens and up */}
    <div className='hidden lp:block top-0 w-full z-50'>
        <DesktopNavBar/>
    </div>
    </header>
    <ProfileDrawer/>
    <CartDrawer/>
  
    </>
  )
}

export default NavBar