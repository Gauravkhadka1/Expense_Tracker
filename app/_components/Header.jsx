
"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link';
import React, { use } from 'react'

function Header() {

  const {user, isSignedIn}=useUser();

  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
        <Image src={'./next.svg'}
        alt='logo'
        width={160}
        height={100}
        />
{isSignedIn?
<UserButton/>:
<Link href={'/sign-in'}>
 <button className='bg-gray-500 p-2 text-white'>Get Started</button>
 </Link>
}
    

        </div>
  )
}

export default Header