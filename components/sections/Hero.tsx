import Header from "../layout/Header";

const Hero = () => {
  return (
    <div className="w-full flex justify-center min-h-screen relative">
      <div className="w-full h-full absolute hero-section z-1"></div>
      <div className="hero-bg-overlay absolute z-2"></div>
      <div className="absolute w-full z-3">
        <Header />
      </div>
      <div className="w-full absolute  bottom-0  z-3 px-5 ">
        <div className="w-full border-[3px] bg-white translate-y-[50px] h-[100px] backdrop-blur-md rounded-2xl p-2 h-100px shadow-lg">
          booking form
        </div>
      </div>
    </div>
  );
};

export default Hero;
