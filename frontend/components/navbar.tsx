"use client";


import { ModeToggle } from "./darkmode";

import GithubIcon from "./ui/github-copilot-icon";




export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 h-15 w-full bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex  h-full  max-w-7xl items-center justify-between ">

       
       <button className="relative  px-3 py-2 transition-all duration-300   hover:bg-black/10 rounded-md dark:hover:bg-white/10">
       <GithubIcon className="mb-0.5" /></button> 
       
        <ModeToggle/>

      </div>
    </header>
  );
}
