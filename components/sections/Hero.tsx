import HeroBooking from "../forms/HeroBooking";
import Header from "../layout/Header";

const Hero = () => {
  return (
    <div className="w-full flex justify-center min-h-screen relative">
      <div className="w-full h-full absolute hero-bg bg-position-[calc(100%+0px)_center]! bg-cover!  md:bg-center! z-1"></div>
      <div className="hero-bg-overlay absolute z-2"></div>
      <div className="absolute w-full z-3">
        <Header />
      </div>
      <div className="w-full absolute  bottom-0 flex justify-center  z-3 px-5 ">
        <HeroBooking />
      </div>
    </div>
  );
};

export default Hero;
