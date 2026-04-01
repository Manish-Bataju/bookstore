import { Outlet } from 'react-router-dom'
import NavBar from '@/components/NavBar.jsx'
import Footer from '@/components/Footer.jsx'
import useShop from '@/hooks/useShop.js';
import ProductForm from '@/Forms/ProductForm.jsx';
import ProductEditForm from '@/Forms/ProductEditForm.jsx';

const RootLayout = () => {
  const { activeAdminForm, setActiveAdminForm, bookEditingForm, setBookEditingForm, setBooks } = useShop();

  const handleUpdateSuccess = (updatedBook) => {
    // No curly braces after the => means it returns the map automatically
    setBooks((prevBooks) =>
      prevBooks.map(book => (book._id === updatedBook._id ? updatedBook : book))
    );

    setBookEditingForm(null);
  };



  return (
    <div className="min-h-screen flex flex-col bg-background font-sans scrollbar-library">
      {/* stays at the top forever */}
      <NavBar />
      <main>
        {/* this is where we plugin our home, baby, product pages plugin */}
        <Outlet />
      </main>

      <Footer />


      {/* 2. THE ALLOCATED ADMIN SPACE */}
      {/* This sits at the very bottom so it covers EVERYTHING (even the Navbar) */}
      {(activeAdminForm || bookEditingForm) && ( // Show overlay if either is active
        <div className="fixed inset-0 z-100 bg-white/95 backdrop-blur-sm overflow-y-auto p-10 flex flex-col">
          <div className="max-w-4xl mx-auto w-full">
            <button
              onClick={() => {
                setActiveAdminForm(null);
                setBookEditingForm(null); // Clear both on close
              }}
              className="mb-8 text-sm font-bold uppercase tracking-widest text-red-500 hover:underline"
            >
              ← Back to Shop
            </button>

            {/* 1. Show Add Form */}
            {activeAdminForm === 'Add' && (
              <ProductForm onSuccess={() => setActiveAdminForm(null)} />
            )}



            {bookEditingForm && (
              <ProductEditForm
                bookId={bookEditingForm} // This is the ID you stored
                onSuccess={handleUpdateSuccess} // Pass the NEW function here
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RootLayout