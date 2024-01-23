import React from "react";
import image from "../../public/Add tasks-pana.png";
import Image from "next/image";
import Link from "next/link";
const HeroSection = () => {
  return (
    <section className="w-full flex h-[100vh]">
      <div className="w-1/2 flex items-center text-4xl font-medium px-20 flex-col justify-center gap-12">
        Streamline Tasks, Boost Productivity: TaskFlow
        <div className="flex gap-8 w-full text-2xl">
          <Link href="/register">
            <button className="bg-blue-500 text-white px-3 py-2 ">
              Get Started
            </button>
          </Link>
          <Link href="/login">
            <button className="border-black border px-3 py-2">Sign In</button>
          </Link>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <Image src={image} alt="taskflow" className="w-[70%]"></Image>
      </div>
    </section>
  );
};

export default HeroSection;
