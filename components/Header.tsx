import Image from "next/image";
import Link from "next/link";
import {RootState } from "./../store/store";
import { BsFillBellFill, BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import image from '../public/netflix.svg'
import { signOut } from "firebase/auth";
import { auth } from "../firebase";




const Header = () => {


  const me = useSelector((state: RootState) => state.user);

  return (
    <header className={`bg-blur duration-300 shadow`}>
      <div className="flex space-x-[40px] items-center">
        <Image
          alt="logo"
          src={image}
          width={100}
          height={100}
          className="cursor-pointer object-contain"
        />
        <ul className="md:flex hidden items-center space-x-[25px]">
          <li className="nav-link">Home</li>
          <li className="nav-link">TV Show</li>
          <li className="nav-link">Movies</li>
          <li className="nav-link">News & Popular</li>
          <li className="nav-link">My List</li>
        </ul>
      </div>

      <div className="flex items-center space-x-[25px] text-sm font-medium">
        <BsSearch className="text-[16px] cursor-pointer" />
        <BsFillBellFill className="text-[18px] cursor-pointer" />
        <Link href="/profile">
          <Image
            src={`${me?.user?.photoURL || "https://robohash.org/facilisdignissimosdolore.png"}`}
            className="rounded-full cursor-pointer h-[30px]"
            alt="image"
            width={30}
            height={30}
          />
        </Link>
        <p className="text-sm cursor-pointer" onClick={() => signOut(auth)}>LogOut</p>
      </div>
    </header>
  );
};

export default Header;
