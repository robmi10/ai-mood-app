"use client"
import React, { useContext, useState } from 'react';
import { MdAccountCircle } from "react-icons/md";
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/lib/components/ui/button';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosSunny } from "react-icons/io";
import { useTheme } from 'next-themes';
import { MoonIcon } from 'lucide-react';
import MoodContext from './context/MoodContext';


const Navbar = () => {
    const { data: session } = useSession()
    const { theme, setTheme } = useTheme()
    const { setAccount } = useContext(MoodContext);
    const [showMenu, setShowMenu] = useState(false);
    if (!session) return false;
    setAccount(session)

    return (
        <>
            <div className='flex justify-center w-full absolute'>
                <div className='w-3/4'>
                    <div className='w-full flex justify-end'>

                        {theme === 'dark' && <IoIosSunny onClick={() => setTheme('light')} size={50} color='white' className='hidden md:flex cursor-pointer relative mt-4 animate-fadeSmooth' />
                        }
                        {(theme === 'light' || theme === 'system') && <MoonIcon onClick={() => setTheme('dark')} size={50} color='white' className='hidden md:flex cursor-pointer relative mt-4 animate-fadeSmooth' />

                        }

                        <div className='hidden md:flex items-center flex-col gap-4 w-24 mt-4'
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}>
                            <MdAccountCircle size={50} color='white' className='hover:cursor-pointer animate-fadeSmooth' />
                            {showMenu && (
                                <Button className="bg-black text-white w-24 rounded-xl shadow-lg animate-fadeSmooth" onClick={() => { signOut() }}>SIGNOUT</Button>
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
                <div className='md:hidden bg-gradient-to-r from-indigo-200 to-indigo-300 dark:bg-gradient-to-r dark:from-indigo-400 dark:to-indigo-700 w-screen h-screen items-center justify-center gap-14 flex flex-col'>
                    {theme === 'dark' && <IoIosSunny onClick={() => setTheme('light')} size={50} color='white' className='flex md:hidden cursor-pointer relative mt-4 animate-fadeSmooth' />
                    }
                    {(theme === 'light' || theme === 'system') && <MoonIcon onClick={() => setTheme('dark')} size={50} color='white' className='flex md:hidden cursor-pointer relative mt-4 animate-fadeSmooth' />
                    }
                    <Button className="bg-black text-white w-24 rounded-xl shadow-lg" onClick={() => { signOut() }}>SIGNOUT</Button>
                </div>
            )}
        </>
    );
}

export default Navbar;
