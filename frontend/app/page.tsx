'use client'
import Herosection from "@/components/herosection";
import Navbar from "@/components/navbar";
import Example from "@/components/example";
import Footer from "@/components/footer";
import { useRef } from "react";


export default function Home() {
  
   const footerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="pt-24">
      
      <Navbar/>
      <Herosection footerRef={footerRef} />
      <Example/>
      <Footer footerRef={footerRef} />
      

    </div>
  );
}
