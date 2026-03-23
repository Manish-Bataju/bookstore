
import wallpaper1 from '../assets/wallpaper1.png';
import wallpaper2 from '../assets/wallpaper2.png';
import wallpaper3 from '../assets/wallpaper3.png';
export const heroSlider =[
  {
    id: 1,
    image: wallpaper1,
    title: "Wanderer's Atlas",
    titleTheme: "font-script text-[#053B06] font-bold text-[40px]",
    subTitle: "An epic journey across uncharted lands, exploring the intersection of ancient history and modern discovery. A masterpiece of world-building.",
    subTheme: "body-reading text-xl text-[#2D3436] text-justify ",
    position: "w-3/4 flex flex-col gap-8", //text position
    btn: "btn-editorial ink-forest ",
    background: "max-lp:hidden flex flex-col items-center justify-center absolute top-1/2 left-[4vw] -translate-y-1/2 z-20 bg-white/80 w-[90vw] lp:w-96 h-full shadow-lg backdrop-blur-[3px] transition-all duration-500"
  },
  {
    id: 2,
    image: wallpaper2,
    title: "Lose Yourself in the World of Words.",
    titleTheme: "font-script text-[#009ddc] font-bold text-[40px]",
    subTitle: "Tune out the noise and dive into a curated universe of fiction, mystery, and fantasy. Your personal sanctuary starts here",
    subTheme: "body-reading font-medium leading-relaxed italic text-xl text-[#0a2463] text-justify ",
    position: "w-3/4 flex flex-col gap-8", //text position
    btn: "btn-editorial ink-germanBlue",
    background: "max-lp:hidden flex flex-col items-center justify-center absolute top-1/2 left-[75vw] -translate-y-1/2 z-20 bg-white/80 w-[90vw] lp:w-96 h-full shadow-lg backdrop-blur-[3px] transition-all duration-500"
  },
  {
    id: 3,
    image: wallpaper3,
    title: "The Silent Echo",
    titleTheme: "font-script text-destructive font-bold text-[40px]",
    subTitle: "A gripping psychological thriller that blurs the line between reality and memory. When a forgotten letter arrives, everything changes",
    subTheme: "body-reading font-medium leading-relaxed italic text-xl text-[#0a2463] text-justify ",
    position:  "w-3/4 flex flex-col gap-8", //text position
    btn: "btn-editorial ink-editorial",
    background: "max-lp:hidden flex flex-col items-center justify-center absolute top-1/2 left-[4vw] -translate-y-1/2 z-20 bg-white/70 w-[90vw] lp:w-96 h-full shadow-lg backdrop-blur-[3px] transition-all duration-500"
  },
]