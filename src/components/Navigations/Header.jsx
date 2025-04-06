import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="h-24 lg:h-14 bg-white -mx-3 lg:m-0 flex justify-center">
      <div className="py-3 max-w-6xl w-full flex items-center justify-between lg:justify-center">
        <div className="flex lg:hidden items-center gap-1.5">
          <img
            src="/assets/images/vignan-logo.png"
            width={42}
            height={42}
            alt="Vignan Logo"
          />
          <span className="text-violet-900 font-semibold text-lg whitespace-nowrap xs:text-base">
            Assessment Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/">
            <img
              src="/assets/images/vignan-header.jpeg"
              className="h-20 w-full object-contain "
              alt="Vignan Header"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
