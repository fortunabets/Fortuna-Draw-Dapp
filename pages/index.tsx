import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import {
  useAddress, useContract, useContractRead, useContractWrite
} from '@thirdweb-dev/react';
import Login from '../components/Login';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CountdownTimer from '../components/CountdownTimer';
import toast from 'react-hot-toast';
import Marquee from 'react-fast-marquee';
import AdminControls from '../components/AdminControls';

const Home: NextPage = () => {

  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);
  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets");
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward");
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission");
  const { data: expiration } = useContractRead(contract, "expiration");
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")
  const { data: tickets } = useContractRead(contract, "getTickets")
  const { data: winnings } = useContractRead(contract, "getWinningsForAddress", address)
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings")
  const { data: lastWinner } = useContractRead(contract, "lastWinner")
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount")
  const { data: isRoundOperator } = useContractRead(contract, "roundOperator")





  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total), 0
    );

    setUserTickets(noOfUserTickets);
  }, [tickets, address])


  const handleBuyClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying your tickets...");

    try {
      const data = await BuyTickets([{
        value: ethers.utils.parseEther(
          (Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString()
        )
      }]);

      toast.success("Tickets bought successfully!", {
        id: notification
      });

      console.info("contract call success", data);
    } catch (err) {

      toast.error("Whoops, something went wrong!", {
        id: notification
      })
      console.error("Contract call Failure", err);
    }
  }

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings...");

    try {
      const data = await WithdrawWinnings([{}]);
      toast.success("Congrats on your winnings!", {
        id: notification
      });


    } catch(err){
      toast.error("Whoops, something went wrong!", {
        id: notification
      })
    }
  }

  if (isLoading) return <Loading />

  if (!address) return (<Login />);

  return (
    <div className="bg-[#0D0D48] min-h-screen flex flex-col">
      <Head>
        <title>Fortuna Draw</title>
      </Head>
      <div className='flex-1'>
        <Header />
        <Marquee className='bg-[#335FB1] p-5 mb-5' gradient={false} speed={100}>
        <div className='flex space-x-2 mx-10'>
          <h4 className='text-white font-bold'>Last Winner: {lastWinner?.toString()}</h4>
          <h4 className='text-white font-bold'>Last Winnings: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())} ETH</h4>
        </div>
        </Marquee>

        {isRoundOperator === address && (
            <div className='flex justify-center'>
              <AdminControls />
            </div>
          )
        }
      {winnings > 0 && (
        <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
          <button onClick={onWithdrawWinnings} className='p-5 bg-gradient-to-b from-[#6e8dc7] to-[#284c8f] animate-pulse text-center rounded-xl w-full text-white'>
            <p className='font-bold'>WINNER WINNER WINNER WINNER!</p>
            <p>Total Winnings: {ethers.utils.formatEther(winnings.toString())}ETH</p>
            <br/>
            <p className='font-semibold'>Click here to withdraw</p>
          </button>
        </div>
      )}

        <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
          <div className='stats-container'>
            <h1 className='text-5xl text-white font-semibold text-center'>The Next Draw</h1>
            <div className='flex justify-between p-2 space-x-2'>
              <div className='stats'>
                <h2 className='text-sm'>Total Pool</h2>
                <p className='text-xl'>{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())} ETH </p>
              </div>
              <div className="stats">
                <h2 className='text-sm'>Tickets Remaining</h2>
                <p className='text-xl'>{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            <div className='mt-5 mb-3'>
              <CountdownTimer />
            </div>
          </div>
          <div className="stats-container space-y-2">
            <div className='stats-container'>
              <div className='flex justify-between items-center text-white pb-2'>
                <h2>Price per ticket</h2>
                <p>{ticketPrice && ethers.utils.formatEther(ticketPrice.toString())} ETH</p>
              </div>
              <div className='flex text-white items-center space-x-2 bg-[#0D0D48] border-[#335FB1] border p-4'>
                <p>TICKETS</p>
                <input className='flex w-full bg-transparent text-right outline-none' type="number" min={1} max={10} step={1}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className='space-y-2 mt-5'>
                <div className='flex items-center justify-between text-[#78b0f0] text-sm italic font-extrabold'>
                  <p>Total Cost of tickets</p>
                  <p>{ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity} ETH</p>
                </div>
                <div className='flex items-center justify-between text-[#78b0f0] text-xs italic'>
                  <p>Fortuna's Cut</p>
                  <p>{ticketCommission && ethers.utils.formatEther(ticketCommission.toString())} ETH</p>
                </div>
                <div className='flex items-center justify-between text-[#78b0f0] text-xs italic'>
                  <p>+ Network Fees</p>
                </div>
              </div>
              <button
                onClick={handleBuyClick}
                disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() === 0}
                className='font-semibold mt-5 w-full bg-gradient-to-br from-[#78b0f0] to to-[#154883] px-10 py-5 rounded-md text-white shadow-xl
             disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-100 disabled:cursor-not-allowed'>
                Buy {quantity} ticket(s) for {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity} ETH
              </button>
            </div>
            {userTickets > 0 && (
              <div className='stats'>
                <p className='text-lg mb-2'>You have {userTickets} tickets in this draw</p>
                <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
                  {Array(userTickets).fill("").map((_, index) => (
                    <p key={index}
                      className="text-[#abc3f0] h-20 w-12 bg-[#335FB1]/30 rounded-lg flex flex-shring-0 items-center justify-center tetx-xs italic"
                    >{index + 1}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div>

          </div>
        </div>
      </div>
      <footer className='border-t border-[#abc3f0]/20 flex items-center text-white justify-between p-5'>
        <img src="./logo-white.PNG" alt=""
          className='h-10 w-10 filter hue-rotate-90 opacity-50 rounded-full'
        />
        <p className='text-xs text-white pl-5'>
          DISCLAIMER: Fortuna is strictly an entartainment platform. None of the information on the application is a financial advice. Do your own research, Fortuna project is not accountable for any of losses made on the platform.
        </p>
      </footer>
    </div>
  )
}

export default Home
