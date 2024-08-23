export function generateSavingsTable() {
    const increments = [5, 10, 20, 50, 100, 200];
    const savingsTable = [];
    let currentTotal = 0;
    
        while (currentTotal < 10000) {
        for (let i = 0; i < increments.length; i++) {
            if (currentTotal + increments[i] <= 10000) {
            savingsTable.push({ amount: increments[i], isSaved: false });
            currentTotal += increments[i];
            }
        }
    }
    return savingsTable;
}