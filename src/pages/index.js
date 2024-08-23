import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'; 
import { generateSavingsTable } from '../../utils/generateSavingsTable'; 

const Home = () => {
  const [user, loading, error] = useAuthState(auth); 
  const [savingsTable, setSavingsTable] = useState(null);
  const [totalSaved, setTotalSaved] = useState(0); // Compteur pour les montants enregistrés

  useEffect(() => {
    const fetchSavingsTable = async () => {
      if (user) {
        try {
          const userRef = doc(firestore, 'users', user.uid); 
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().savingsTable) {
            const table = userSnap.data().savingsTable;
            setSavingsTable(table);
            updateTotalSaved(table);
          } else {
            const newTable = generateSavingsTable();
            await setDoc(userRef, { savingsTable: newTable }, { merge: true });
            setSavingsTable(newTable);
            updateTotalSaved(newTable);
          }
        } catch (e) {
          console.error("Error fetching savings table:", e);
        }
      }
    };
    fetchSavingsTable();
  }, [user]);

  const updateTotalSaved = (table) => {
    const total = table.reduce((acc, item) => item.isSaved ? acc + item.amount : acc, 0);
    setTotalSaved(total);
  };

  const toggleSave = async (index) => {
    const updatedSavingsTable = savingsTable.map((item, idx) => {
      if (idx === index) {
        return { ...item, isSaved: !item.isSaved };
      }
      return item;
    });
    setSavingsTable(updatedSavingsTable);
    updateTotalSaved(updatedSavingsTable);
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, { savingsTable: updatedSavingsTable }, { merge: true });
  };

  const deleteSavingsTable = async () => {
    const userRef = doc(firestore, 'users', user.uid);
    await deleteDoc(userRef);
    setSavingsTable(null);
    setTotalSaved(0);
  };

  const regenerateSavingsTable = async () => {
    const newTable = generateSavingsTable();
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, { savingsTable: newTable }, { merge: true });
    setSavingsTable(newTable);
    updateTotalSaved(newTable);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!user) {
    return <div>Connectez-vous pour générer un tableau de suivi.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-3xl">
        <h1 className="text-white text-2xl mb-5">Savings Dashboard</h1>
        <div className="text-white mb-5">Total économisé: {totalSaved}€</div>
        {savingsTable ? (
          <div>
            <div className="grid grid-cols-4 gap-4">
              {savingsTable.map((entry, index) => (
                <div 
                  key={index} 
                  onClick={() => toggleSave(index)}
                  className={`p-4 text-center rounded cursor-pointer ${
                    entry.isSaved ? 'bg-green-500' : 'bg-gray-700'
                  } text-white`}
                >
                  {entry.amount}€
                </div>
              ))}
            </div>
            <button onClick={deleteSavingsTable} className="mt-4 bg-red-500 text-white p-2 rounded">Supprimer le tableau</button>
            <button onClick={regenerateSavingsTable} className="mt-4 bg-blue-500 text-white p-2 rounded">Regénérer un tableau</button>
          </div>
        ) : (
          <>
            <div className="text-white">Aucun tableau sauvegardé</div>
            <button onClick={regenerateSavingsTable} className="mt-4  bg-blue-500 text-white p-2 rounded">Regénérer un tableau</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
