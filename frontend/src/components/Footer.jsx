import logo from '@/assets/Pukucha_logo-01.png';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='grid grid-cols-6 gap-3 bg-destructive items-center p-5 text-white'>
      <div className='flex flex-col items-center'>
         <img src={logo} alt={logo} className='h-12'/>
         <div className='flex flex-col gap-2'>
          <p className='text-center'>Jamal, Kantipath, Kathmandu</p>
          <p className='text-center'>+977 9841234567</p>
          <p className='text-center'>email@customer.com </p>
         </div>
      </div>
      
      <NavLink>
        <ul className='flex flex-col gap-2'>
          <li>Company</li>
          <li>Size Chart</li>
          <li>Return Policy</li>
          <li>Refund Policy</li>
        </ul>
      </NavLink>

      <NavLink>
        <ul className='flex flex-col gap-2'>
          <li>Company</li>
          <li>Size Chart</li>
          <li>Return Policy</li>
          <li>Refund Policy</li>
        </ul>
      </NavLink>

      <NavLink>
        <ul className='flex flex-col gap-2'>
          <li>Company</li>
          <li>Size Chart</li>
          <li>Return Policy</li>
          <li>Refund Policy</li>
        </ul>
      </NavLink>

      <NavLink>
        <ul className='flex flex-col gap-2'>
          <li>Company</li>
          <li>Size Chart</li>
          <li>Return Policy</li>
          <li>Refund Policy</li>
        </ul>
      </NavLink>

      <NavLink>
        <ul className='flex flex-col gap-2'>
          <li>Sign for Offers & NewsLetter</li>
          <li>
            <input type="text" placeholder="Enter your email"
          className='border bg-white rounded-lg px-3 py-1' />
          </li>
          
        </ul>
      </NavLink>
    </div>
  )
}

export default Footer