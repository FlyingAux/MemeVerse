'use client'
import React from 'react'
import Link from 'next/link'
import { IoMdHome } from "react-icons/io";
import { FaRankingStar } from "react-icons/fa6";
import { FiTrendingUp } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

const Nav = () => {
  return (
    <>
        <div className='nav-main h-20 w-full flex items-center justify-center text-xl fixed z-50'>
            <div className='nav-left h-20 w-1/2 flex items-center justify-start gap-5 px-20'>
                <Link href={'/'} className='flex items-center justify-center gap-2'><IoMdHome /> Home</Link>
                <Link href={'/top'} className='flex items-center justify-center gap-2'><FaStar /> Top</Link>
                <Link href={'/trending'} className='flex items-center justify-center gap-2'><FiTrendingUp /> Trending</Link>
                <Link href={'/rankings'} className='flex items-center justify-center gap-2'><FaRankingStar /> Rankings</Link>
            </div>
            <div className='nav-right h-20 w-1/2 flex items-center justify-end gap-5 px-20'>
                <h1 className='flex items-center justify-center'><IoIosSearch /></h1>
                <Link href={'/login'} className='flex items-center justify-center'>Login/Sign-up</Link>
                <Link href={'/uploadmeme'} className='flex items-center justify-center'>Upload meme</Link>
            </div>
        </div>
    </>
  )
}

export default Nav