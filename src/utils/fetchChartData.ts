import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@utils/firebaseConfig';

export async function fetchChartData(temporality: string) {
    // const collectionName = temporality === 'daily' ? import.meta.env.PUBLIC_FIRESTORE_DAILY_SELL_COLLECTION : import.meta.env.PUBLIC_FIRESTORE_HOURLY_SELL_COLLECTION;
    const collectionName = temporality === 'daily' ? import.meta.env.PUBLIC_FIRESTORE_DAILY_SELL_COLLECTION : import.meta.env.PUBLIC_FIRESTORE_BINANCE_COLLECTION;
    const q = query(collection(db, collectionName), orderBy("timestamp", "desc"), limit(10));

    const querySnapshot = await getDocs(q);
    let data: number[] = [];
    let timestamps: string[] = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data().averagePrice);
        const timestampDate = doc.data().timestamp.toDate();
        timestamps.push(timestampDate.toLocaleTimeString('es-ES', { hour: '2-digit'}));
    });

    return {
        prices: data.reverse(),
        labels: timestamps.reverse(),
    };
}
