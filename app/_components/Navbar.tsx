"use client"
import React, { useState } from 'react';
import { MdAccountCircle } from "react-icons/md";
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/lib/components/ui/button';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";

const Navbar = () => {
    const { data: session } = useSession()
    const [showMenu, setShowMenu] = useState(false);
    if (!session) return false;

    return (
        <>
            <div className='flex justify-center w-full absolute'>
                <div className='w-3/4'>
                    <div className='w-full flex justify-end'>
                        <div className='hidden md:flex items-center flex-col gap-4 w-24 mt-4'
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}>
                            <MdAccountCircle size={50} color='white' className='hover:cursor-pointer' />
                            {showMenu && (
                                <Button className="bg-black text-white w-24 rounded-xl shadow-lg" onClick={() => { signOut() }}>SIGNOUT</Button>
                            )}
                        </div>
                        <div className='flex md:hidden items-center flex-col gap-4 w-24 mt-4'
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}>
                            {!showMenu && < RxHamburgerMenu size={50} color='white' className='hover:cursor-pointer' />
                            }
                            {showMenu && < IoCloseOutline size={50} color='white' className='hover:cursor-pointer' onClick={() => { setShowMenu(false) }} />
                            }
                        </div>
                    </div>
                </div>
            </div>

            {showMenu && (
                <div className='md:hidden bg-red-300 w-screen h-screen items-center justify-center gap-4 flex'>
                    <Button className="bg-black text-white w-24 rounded-xl shadow-lg" onClick={() => { signOut() }}>SIGNOUT</Button>
                </div>
            )}
        </>
    );
}

export default Navbar;
