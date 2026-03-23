const AnnouncementBar = () => {
  return (
    <div className='relative overflow-hidden border-b border-border bg-background max-mls:py-1'>
        {/* On Mobile: This flex container will animate.  On Desktop: We keep it centered. */}
        <div className="flex gap-50 whitespace-nowrap w-max animate-marquee tls:animate-none tls:transform-none tls:justify-center tls:w-full">
            <p className='body-reading font-bold'>
            Free delivery over <span className="text-primary"> Rs 5000 </span>
            <span className="font-medium">
              *Terms don't apply on clearance products*
          </span></p>

          <p className='body-reading font-bold tls:hidden'>
            Free delivery over <span className="text-primary"> Rs 5000 </span>
            <span className="font-medium">
              *Terms don't apply on clearance products*
          </span></p>

        </div>

        
    </div>
  )
}


export default  AnnouncementBar;