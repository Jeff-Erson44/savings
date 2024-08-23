'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../firebase/config';
import { generateSavingsTable } from '../../../utils/generateSavingsTable';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore methods

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      const user = res.user;

      // Clear the form fields after sign up
      setEmail('');
      setPassword('');

      // Initialize the savings table for the new user
      const savingsTable = generateSavingsTable();

      // Store the savings table and user info in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        savingsTable,
        totalSavings: 0 // Initialize total savings to 0
      });

    } catch (e) {
      console.error("Error during sign up:", e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-4 sm:p-10 rounded-lg shadow-xl max-w-5/6 w-5/6 sm:w-5/6">
        <h1 className="text-white text-xl sm:text-2xl mb-4">Sign Up</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-2 sm:p-3 mb-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-2 sm:p-3 mb-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSignUp}
          className="w-full p-2 sm:p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
