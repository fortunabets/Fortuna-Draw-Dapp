import React from 'react'

import {
    StarIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    ArrowUturnDownIcon
} from "@heroicons/react/24/solid";
import { useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';


const AdminControls = () => {
    const { contract, isLoading } = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);
    const { data:  operatorTotalCommission} = useContractRead(contract, "operatorTotalCommission")
    const { mutateAsync: DrawWinnerTicket } = useContractWrite(contract, "DrawWinnerTicket")
    const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll")
    const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw")
    const { mutateAsync: WithdrawCommission } = useContractWrite(contract, "WithdrawCommission")

    const drawWinner = async () => {
        const notification = toast.loading("Picking a lucky winner!");

        try {
            const data = await DrawWinnerTicket([{}]);
            toast.success("A Winner has been selected!", {
                id: notification
            });
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong", {
                id: notification
            });

            console.error("contract call failure", err)
        }
    }

    const onWithdrawCommission = async () => {
        const notification = toast.loading("Withdrawing Commission!");

        try {
            const data = await WithdrawCommission([{}]);
            toast.success("Commission withdrawn!", {
                id: notification
            });
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong", {
                id: notification
            });

            console.error("contract call failure", err)
        }
    }
    
    const onRestardDraw = async () => {
        const notification = toast.loading("Restarting the draw!");

        try {
            const data = await restartDraw([{}]);
            toast.success("Draw restarted!", {
                id: notification
            });
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong", {
                id: notification
            });

            console.error("contract call failure", err)
        }
    }
    
    const onRefundAll = async () => {
        const notification = toast.loading("Refunding the draw!");

        try {
            const data = await RefundAll([{}]);
            toast.success("Draw refunded!", {
                id: notification
            });
            console.info("contract call success", data);
        } catch (err) {
            toast.error("Whoops something went wrong", {
                id: notification
            });

            console.error("contract call failure", err)
        }
    }




    return (
        <div className='text-white text-center px-5 py-3 rounded-md border-[#335FB1]/50 border'>
            <h2 className='font-bold'>Admin Controls</h2>
            <p className='mb-5'>Total comission to be withdrawn: {operatorTotalCommission && ethers.utils.formatEther(operatorTotalCommission?.toString())} ETH</p>
            <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
                <button className='admin-button' onClick={drawWinner}>
                    <StarIcon className='h-6 mx-auto mb-2' />
                    Draw Winner
                </button>
                <button className='admin-button' onClick={onWithdrawCommission}>
                    <CurrencyDollarIcon className='h-6 mx-auto mb-2' />
                    Withdraw Comission
                </button>
                <button className='admin-button' onClick={onRestardDraw}>
                    <ArrowPathIcon className='h-6 mx-auto mb-2' />
                    Restart Draw
                </button>
                <button className='admin-button' onClick={onRefundAll}>
                    <ArrowUturnDownIcon className='h-6 mx-auto mb-2' />
                    Refund All
                </button>
            </div>
        </div>
    )
}

export default AdminControls