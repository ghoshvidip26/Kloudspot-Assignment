"use client"
import { useState } from "react";
import Link from "next/link";

interface MenuItem {
  title: string;
  src: string;
  href: string;
}

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const Menus: MenuItem[] = [
    { title: "Overview", src: "home", href: "/home" },
    { title: "Crowd Entries", src: "Layer2", href: "/crowd-entries" }
  ];

  return (
    <div className="flex h-screen">
      <div
        className={`${open ? "w-[200px]" : "w-20"
          } bg-[#2D3748] h-full relative duration-300 flex flex-col`}
        style={{
          background: 'radial-gradient(130.14% 50% at 50% 50%, #0A5D5C 0%, #282829 100%)'
        }}
      >
        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L50 50M50 0L0 50M50 50L100 0M50 50L100 100M0 100L50 50' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Header with logo and hamburger */}
        <div className="p-5 pt-6 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="kloudspot logo"
                className="w-8 h-8"
              />
              <h1
                className={`text-white font-semibold text-lg duration-200 ${!open && "scale-0 w-0"
                  } origin-left`}
              >
                kloudspot
              </h1>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="text-white hover:bg-white/10 p-1 rounded"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          {/* Menu items */}
          <ul className="space-y-2">
            {Menus.map((menu, index) => (
              <li
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedIndex === index
                  ? "bg-[#4A5568] text-white"
                  : "text-gray-300 hover:bg-white/5"
                  }`}
              >
                <Link href={menu.href}>
                  <img
                    src={`/${menu.src}.png`}
                    alt={menu.title}
                    className="w-5 h-5 flex-shrink-0"
                  />
                  <span
                    className={`${!open && "hidden"
                      } origin-left duration-200 text-sm font-medium whitespace-nowrap`}
                  >
                    {menu.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout button at bottom */}
        <div className="mt-auto p-5 relative z-10">
          <button
            className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-white/5 transition-all duration-200 w-full"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="flex-shrink-0"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span
              className={`${!open && "hidden"
                } origin-left duration-200 text-sm font-medium`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
