import { ShineBorder } from "./ui/shine-border"
import Image from "next/image"

export default function Example() {
 

  return (
    <div className="flex relative w-fit h-fit   mx-auto mt-40 h-screen rounded-2xl bg-gray-100 dark:bg-[#0A0A0A] overflow-hidden">
      
       <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      {/* Content */}
      <div className="relative justify-around  w-fit  z-10 p-4  dark:text-white">
        <h1 className="w-fit mb-4 mx-auto text-xl font-semibold ">Before </h1>
         <Image
           className="rounded-sm tranform transition-transform duration-500 ease-in-out hover:scale-105"
           src="/Image/nonredact.png"   
          alt="Non redacted"
          width={450}
          height={350}
         />
      </div>

       <div className="relative w-fit h-fit  z-10 p-4   dark:text-white">
        <h1 className="w-fit mb-4 mx-auto text-xl  font-semibold ">After </h1>
         <Image
           className="rounded-sm transform transition-transform duration-500 ease-in-out hover:scale-105"
           src="/Image/redact.png"   
          alt=" redacted"
         width={450}
          height={350}
         />
      </div>

     
    </div>
  )
}
