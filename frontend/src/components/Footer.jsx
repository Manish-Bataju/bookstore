import logo from '@/assets/Pukucha_logo-01.png';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
      <img src={logo} alt={logo} className='h-2'/>
      <NavLink>
        <ul>
          <li>Company</li>
          <li>Size Chart</li>
          <li>Return Policy</li>
          <li>Refund Policy</li>
          <li>hello</li>
          <li>Micro </li>
        </ul>
      </NavLink>
    </div>
  )
}

export default Footer