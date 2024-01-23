"use client";

import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

const Home = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  //const userSession = window.sessionStorage.getItem("user");
  console.log({ user });

  useEffect(() => {
    if (!user) {
      router.push("/register");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="w-screen h-screen">
      <NavBar />
      <HeroSection />
    </main>
  );
};

export default Home;
