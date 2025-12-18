'use client'
import axios from "axios"
import Link from "next/link"

export default function Home() {
  const handleclick = async () => {
     console.log("clicked")
    const res = await axios.get('http://localhost:3000/api/auth/me')
  }
  return (
    <div>
      <Link href={'/dashboard'}>Click me</Link>

      <button type="button" onClick={handleclick} className=" bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none">Default</button>

    </div>
  )
}