"use client";
import React, { FormEvent, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your login logic here (e.g., API call, authentication, etc.)
    console.log("Logging in with:", { Email, password });
    try {
      const res = await signInWithEmailAndPassword(Email, password);
      console.log({ res });
      sessionStorage.setItem("user", true.toString());
      setEmail("");
      setPassword("");
      router.push("/tasks");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="w-screen h-screen bg-blue-200 flex justify-center items-center">
      <div className="w-1/3 h-2/3 bg-white rounded-xl shadow-2xl flex-col flex justify-center items-center p-8">
        <h1 className="text-2xl font-medium mb-4">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col w-5/6">
          <label htmlFor="email" className="mb-2">
            E-mail
          </label>
          <input
            type="text"
            id="E-mail"
            name="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 rounded-md mb-4"
            required
          />

          <label htmlFor="password" className="mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded-md mb-4"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
