
import { AnimatedGradientText } from "./ui/animated-gradient-text"
import { GradientBorder } from "./ui/gradientborder"
import { RainbowButton } from "./ui/rainbow-button"
import AnimatedButton  from "./ui/animated-button"
import { RefObject, useRef } from "react";




export default function Herosection({
  footerRef,
}: {
  footerRef: RefObject<HTMLDivElement | null>;
}) {

  

  const handleScroll = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };


    return (
        <div className=" h-fit  ">
            <div className="mt-10    w-fit mx-auto">
                <GradientBorder>
                   🎉 <AnimatedGradientText className="font-semibold "> Introducing version 2.0</AnimatedGradientText>
                </GradientBorder>



            </div>

            <div className="w-fit h-fit mx-auto">
                <h1 className="mt-3 text-7xl font-bold text-center ">Secure your pdf  In  </h1>
                <h2 className="mt-2 text-7xl font-bold text-center "> Seconds </h2>
                <h2 className="mt-6 text-center font-semibold opacity-50"> A simple project build top of aws cloud services where you can protect your pdf </h2>

                 
                
              
            </div> 
             

             <div className="mt-8 dark:bg-[#0A0A0A]   w-fit mx-auto  ">
                 <RainbowButton
                    onClick={handleScroll}
                   className="bg-[#0A0A0A] px-9  font-semibold text-md rounded-md transition-all duration-300 active:scale-95">Get Started </RainbowButton>
                
                 </div>

            

             

               

        </div>
    )
}