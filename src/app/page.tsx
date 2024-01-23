"use client";

import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

const Home = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  //const userSession = window.sessionStorage.getItem("user");
  console.log({ user });
  console.log(sessionStorage);

  if (!user) {
    router.push("/register");
  }
  return (
    <main className="w-screen h-screen">
      <NavBar />
      <HeroSection />
    </main>
  );
};

export default Home;
