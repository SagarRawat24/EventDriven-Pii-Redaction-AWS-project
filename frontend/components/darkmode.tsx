"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import BrightnessDownIcon from "./ui/brightness-down-icon"
import MoonIcon from "./ui/moon-icon"


export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    
      <button
        className="relative text-center hover:bg-black/10 transition-all duration-300 dark:hover:bg-white/10 px-2 py-1 rounded-md "
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
      >
        <MoonIcon className=" absolute 
          dark:rotate-90 dark:scale-0 mt-1.5  
        "/>
        <BrightnessDownIcon
          className="
          rotate-90 scale-0
          dark:rotate-0 dark:scale-100
          mt-1
        "

        />
      </button>

    
  )
}