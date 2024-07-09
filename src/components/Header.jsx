import React from "react";

export function Header() {
  return (
    <header className="flex bg-white min-h-[60px]  bg-opacity-[10%] backdrop-blur-md rounded-[50px] text-[18px] px-9 justify-between text-white items-center">
      <div className="logo">ISRAR KHAN</div>

      <ul className="menu-container flex gap-9">
        <li>Home</li>
        <li>About</li>
        <li>Hello!</li>
      </ul>
    </header>
  );
}
