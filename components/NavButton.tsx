import React from 'react'

interface Props {
    title: string;
    isActive?: boolean;
    onClick?: () => void;
}

const NavButton = ({ title, isActive, onClick }: Props) => {
  return (
    <button
        onClick={onClick}
     className={`${isActive && "bg-[#335FB1]"} text-white py-2 px-4 rounded hover:bg-[#335FB1] font-bold` }>
        {title}
    </button>
  )
}

export default NavButton