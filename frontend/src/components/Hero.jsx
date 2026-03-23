import {heroSlider} from '../Constants/HeroSlider.js';
import useShop from '@/hooks/useShop'; // Update the path to where useShop is exported
import { useEffect, useState } from 'react';



export default function Hero() {
    const {headerHeight} = useShop();

    
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentSlide = heroSlider[currentIndex];
    const autoSlideInterval = 5000;

    useEffect(() => {
      const slideInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex === heroSlider.length -1 ? 0 : prevIndex+1 );
      }, autoSlideInterval);

      return () => clearInterval(slideInterval);
     })

  return (
    <section className='w-full h-full relative overflow-hidden'
    style={{ height: `calc(100dvh - ${headerHeight}px)` }}>
        
        {/* Image Layer */}
        <div key={currentIndex} className="w-full h-full" >
             <img
             src={currentSlide.image}
             alt={currentSlide.image}
             className='absolute inset-0 w-full h-full object-cover object-top z-0'/>
        </div>

        {/* Text Layer */}
        <div className={`${currentSlide.background}` }>
          <div className={`${currentSlide.position}`}>
          <h1 className={`${currentSlide.titleTheme}`}>"{currentSlide.title}"</h1>
          <p className={`${currentSlide.subTheme}`}>{currentSlide.subTitle}</p>
          <div className="flex justify-center gap-10">
          <button className={`${currentSlide.btn}`}>Shop Now</button>
          <button className={`${currentSlide.btn}`}>Order Now</button>
          </div> 
        </div>  
        </div>
    </section>
  )
}
