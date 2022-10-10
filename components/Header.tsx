import React from 'react'
import NavButton from './NavButton'

import { GlobeAltIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { useAddress, useDisconnect } from '@thirdweb-dev/react';

const Header = () => {

    const address = useAddress();
    const disconnect = useDisconnect();

    return (
        <header className='grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5'>
            <div className='flex items-center space-x-2'>
                <img src="./logo-white.PNG" alt=""
                    className='rounded-full h-20 w-20'
                />
                <div>
                    <h1 className='text-lg text-white font-bold'>Fortuna Draw</h1>
                    <p className='text-xs text-[#78b0f0] truncate'>User: {address?.substring(0, 5)}...{address?.substring(address.length, address.length - 5)}</p>
                </div>
            </div>
            <div className='hidden md:flex md:col-span-3 items-center justify-center rounded-md'>
                <div className='bg-[#0D0D48] p-4 space-x-2'>
                    <NavButton isActive title="$FORTUNA" onClick={() => window.open('https://linktr.ee/fortunabets', '_blank')}/>
                    <NavButton onClick={disconnect} title="Disconnect" />
                </div>
            </div>

            <div className='flex flex-col ml-auto text-right'>
                <div className='flex space-x-4 justify-center'>
                    <GlobeAltIcon className='h-8 w-8  text-white cursor-pointer' onClick={() => window.open('https://fortuna-games.com', '_blank')}/>
                    <CurrencyDollarIcon className='h-8 w-8  text-white cursor-pointer' onClick={() => window.open('https://app.uniswap.org/#/swap', '_blank')} />
                </div>
                <span className='md:hidden'>
                    <NavButton onClick={disconnect} title="Disconnect" />
                </span>
            </div>
        </header>
    )
}

export default Header