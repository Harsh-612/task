"use client";
import { auth, firestore, users as userReference } from "@/firebase/firebase";
import { addDoc } from "firebase/firestore";
import React, { FormEvent, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Registering with:", { email, password, username, fullName });
    try {
      const res = await createUserWithEmailAndPassword(email, password);

      console.log({ res });
      if (res && res.user) {
        const uid = res.user.uid;
        addDoc(userReference, { uid, username, fullName });
      }
      sessionStorage.setItem("user", true.toString());
      setEmail("");
      setPassword("");
      setUsername("");
      setFullName("");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <main className="w-screen h-screen bg-blue-200 flex justify-center items-center">
      <div className="w-2/5 h-4/5 bg-white rounded-xl shadow-2xl flex-col flex justify-center items-center p-8">
        <h1 className="text-2xl font-medium mb-4">Create an Account</h1>
        <form onSubmit={handleRegister} className="flex flex-col w-[95%]">
          <label htmlFor="email" className="mb-2">
            Enter Your Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 rounded-md mb-4"
            placeholder="e.g., john@example.com"
            required
          />

          <label htmlFor="password" className="mb-2">
            Create a Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded-md mb-4"
            placeholder="At least 8 characters"
            required
          />

          <label htmlFor="username" className="mb-2">
            Choose a Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-2 rounded-md mb-4"
            placeholder="e.g., john_doe"
            required
          />

          <label htmlFor="fullName" className="mb-2">
            Enter Your Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-300 p-2 rounded-md mb-4"
            placeholder="e.g., John Doe"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
          {error.length > 0 && ""}
        </form>
      </div>
    </main>
  );
};

export default Register;
