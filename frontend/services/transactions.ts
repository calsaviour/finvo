export const createTransaction = async (transaction: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TRANSACTIONS_API_URL}/transactions`, {
        method: 'POST',
        body: JSON.stringify(transaction),
    });
    const data = await response.json();
    return data;
}