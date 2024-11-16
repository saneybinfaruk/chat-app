"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiFillMessage, AiOutlineSetting } from "react-icons/ai";
import { BiBell } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import { SlHome } from "react-icons/sl"; 

function Navbar() {
  const [selectedMenu, setSelectedMenu] = useState("/messages");
 
  const iconSize = 32;
  const iconColor = "white";

  const icons = [
    {
      href: "/messages",
      component: <AiFillMessage size={iconSize} color={iconColor} />,
    },
    {
      href: "/notifications",
      component: <BiBell size={iconSize} color={iconColor} />,
    },
    {
      href: "/Setting",
      component: <AiOutlineSetting size={iconSize} color={iconColor} />,
    },
  ];
  const pathName = usePathname();

  return (
    <div className="flex flex-col items-center justify-between bg-violet-700 rounded-2xl gap-20 h-full py-8">
      <div className="flex flex-col items-center gap-6 w-full">
        <Link
          href={"/me"}
          className={`avatar ring rounded-full hover:ring-violet-200 ${
            selectedMenu === "/me" ? "ring-white" : "ring-violet-400"
          } transition-all duration-200`}
          onClick={() => setSelectedMenu("/me")}
        >
          <div className="w-16 rounded-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="Tailwind-CSS-Avatar-component"
            />
          </div>
        </Link>

        <div className="flex flex-col w-full gap-1 mt-2">
          {icons.map(({ href, component }) => (
            <Link
              key={href}
              className={`relative hover:bg-violet-800 flex items-center justify-center py-4 transition-colors duration-200  ${
                pathName.includes(href)
                  ? "bg-violet-800 border-r-4 border-yellow-500"
                  : "bg-violet-700 "
              }`}
              href={href}
              onClick={()=>{}}
            >
              {href === "/notifications" && 0 > 0 && (
                <span className="absolute badge badge-primary top-0 right-2">{0}</span>
              )}
              {component}
            </Link>
          ))}
        </div>
      </div>

      <Link href={"/api/auth/signout"} className="btn btn-ghost btn-circle">
        <IoLogOut size={iconSize} color={iconColor} />
      </Link>
    </div>
  );
}

export default Navbar;
