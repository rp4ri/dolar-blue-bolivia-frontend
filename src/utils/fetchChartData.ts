import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@utils/firebaseConfig';

export async function fetchChartData(temporality: string) {
    // const collectionName = temporality === 'daily' ? import.meta.env.PUBLIC_FIRESTORE_DAILY_SELL_COLLECTION : import.meta.env.PUBLIC_FIRESTORE_HOURLY_SELL_COLLECTION;
    const collectionName = temporality === 'daily' ? import.meta.env.PUBLIC_FIRESTORE_BINANCE_END_OF_THE_DAY_COLLECTION : import.meta.env.PUBLIC_FIRESTORE_BINANCE_COLLECTION;
    // console.log('collectionName', collectionName)
    const q = query(collection(db, collectionName), orderBy("timestamp", "desc"), limit(10));

    const querySnapshot = await getDocs(q);
    let data: number[] = [];
    let timestamps: string[] = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data().averagePrice);
        const timestampDate = doc.data().timestamp.toDate();
        let timestampDateToLocaleString = temporality === 'daily' ? timestampDate.toLocaleDateString('es-ES', { day: '2-digit' }) : timestampDate.toLocaleTimeString('es-ES', { hour: '2-digit'});
        timestamps.push(timestampDateToLocaleString);
    });

    // console.log('data', data);
    // console.log('timestamps', timestamps);

    return {
        prices: data.reverse(),
        labels: timestamps.reverse(),
    };
}
