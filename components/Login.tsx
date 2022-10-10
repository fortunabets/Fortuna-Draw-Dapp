import { useMetamask } from '@thirdweb-dev/react'
import React from 'react'

const Login = () => {
    const connectWithMetamask = useMetamask();
  return (
    <div className='bg-[#0D0D48] min-h-screen flex flex-col items-center justify-center text-center'>
        <div className='flex flex-col items-center mb-10'>
            <img src="./logo-white.PNG" className='rounded-full h-56 w-56 mb-10' alt="" />
            <h1 className='text-6xl text-white font-bold'>Fortuna Draw</h1>
            <h2 className='text-white'>Get Started by connecting your wallet!</h2>
            <button className='bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'
                onClick={connectWithMetamask}
            >Login with Metamask</button>
        </div>
    </div>
  )
}

export default Login