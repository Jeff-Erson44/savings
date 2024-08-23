import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config'; // Assure-toi que le chemin vers ton fichier config est correct
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router'; // Importe le hook useRouter de Next.js
import Link from 'next/link';

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter(); // Utilise le hook useRouter pour manipuler la navigation

  if (loading) {
    return <div>Loading...</div>; // Ou un spinner/loader selon ton design
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/signin'); // Rediriger vers la page de connexion après déconnexion
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSignIn = () => {
    router.push('/signin'); // Redirige vers la page de connexion
  };

  const handleSignUp = () => {
    router.push('/signup'); // Redirige vers la page d'inscription
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 p-2 md:p-4 text-white flex justify-between z-50">
        <Link href='/'>
            <h1 className="text-base md:text-lg">My App</h1>
        </Link>
      {user ? (
        <button onClick={handleSignOut} className="text-sm md:text-base bg-red-500 hover:bg-red-700 font-bold py-1 px-2 rounded">
          Déconnexion
        </button>
      ) : (
        <div>
          <button onClick={handleSignIn} className="text-sm md:text-base bg-blue-500 hover:bg-blue-700 font-bold py-1 px-2 rounded mr-2">
            Connexion
          </button>
          <button onClick={handleSignUp} className="text-sm md:text-base bg-green-500 hover:bg-green-700 font-bold py-1 px-2 rounded">
            Créer un compte
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
