import Image from "next/image";
import cover from "../public/Image.png"
import Login from "./components/Login";

export default function Home() {
  return (
    <div className="flex justify-between items-center p-20 h-screen w-full relative">
      <Image layout="fill" objectFit="cover" quality={100} src={cover} alt="cover" className="-z-10" /> 
      <div className="absolute inset-0 bg-black/60 z-0" /> {/* Dark overlay */} 
      <p className="text-4xl font-bold text-white z-20 w-[428px]">Welcome to the crowd management system</p>
      <Login />
    </div>
  );
}
