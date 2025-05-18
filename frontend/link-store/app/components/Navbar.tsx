import Image from 'next/image'
import React from 'react'
import logo from '../../public/logo.png'
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const handleLoginClick = () => {
        router.push("/login");
    }
    const handleSignupClick = () => {
        router.push("/signup");
    }
  return (
    <div className='w-full flex items-center justify-between px-4 max-w-11/12 py-2 rounded-full border shadow-lg'>
        <div className='flex items-center gap-2'>
            {/* Left side */}
            {/* Logo */}
            <Image src={logo} alt={""} width={24}/>
            <p className='text-gray-950 text-sm font-semibold'>Link store</p>
        </div>
        <div className='flex gap-4'>
            {/* Right side */}
            <button onClick={handleLoginClick} className='bg-[#EFF0EC] px-2 py-1 cursor-pointer rounded-md hover:scale-95 hover:bg-[#dcddd9] transition-all d ease-in'>
                <p className="text-gray-950 font-semibold">
                    Login
                </p>
            </button>
            <button onClick={handleSignupClick} className='bg-gray-800 px-4 py-1 cursor-pointer font-semibold rounded-2xl hover:scale-95 hover:bg-gray-950 transition-all d ease-in'>
                <p>
                    Sign up for free
                </p>
            </button>
        </div>
    </div>
  )
}
