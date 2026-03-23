import { Outlet } from 'react-router-dom'
import NavBar from '@/components/NavBar.jsx'
import Footer from '@/components/Footer.jsx'

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans scrollbar-library">
      {/* stays at the top forever */}
      <NavBar/>
      <main>
        {/* this is where we plugin our home, baby, product pages plugin */}
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default RootLayout