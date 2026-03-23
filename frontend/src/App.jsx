import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RootLayout from '@/layout/RootLayout.jsx';
import './index.css';

import Genres  from './Pages/Genres.jsx';
import Featured from './Pages/Featured.jsx';
import Special from './Pages/Special.jsx';
import Cart from '../src/Pages/Cart.jsx';
import Rent from '../src/Pages/Rent.jsx';
import Stationery from './Pages/Stationery.jsx';
import Profile from '../src/Pages/Profile.jsx';
import Home from '../src/Pages/Home.jsx';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<RootLayout/>}>
        <Route index element={<Home/>}/>
       {/* These pages "Fill the hole" inside the Layout */}
        <Route path='genres' element={<Genres />}/>
        <Route path='featured' element={<Featured />}/>
        <Route path='special' element={<Special/>}/>
        <Route path='stationery' element={<Stationery />}/>
        <Route path='rent' element={<Rent/>}/>
        <Route path='cart' element={<Cart/>}/>
        <Route path='profile' element={<Profile/>} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
