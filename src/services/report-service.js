import { db } from '../config/firebase-config.js';
import { collection, doc, setDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class ReportService {
    constructor() {
        this.reportsCollection = collection(db, "reports");
    }

    // Client-side image compression to bypass Firestore 1MB limits
    compressImage(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve("https://dummyimage.com/400x250/1c2333/00e5ff.png&text=No+Photo+Uploaded");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Cap width to keep size down
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Compress to 60% quality JPEG (Outputs a tiny Base64 string)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    resolve(compressedBase64);
                };
            };
            reader.onerror = (error) => reject(error);
        });
    }

    async createReport(data, file, userId) {
        try {
            // Wait for the browser to compress the image
            const safePhotoString = await this.compressImage(file);
            const reportId = `report_${Date.now()}`;
            
            const payload = {
                category: data.category,
                description: data.description,
                photoUrl: safePhotoString,
                latitude: data.latitude,
                longitude: data.longitude,
                userId: userId, 
                upvotes: 1,
                status: "active",
                comments: [],
                timestamp: new Date().toISOString()
            };

            await setDoc(doc(this.reportsCollection, reportId), payload);
            return reportId;
        } catch (error) {
            console.error("Database write failed:", error);
            throw error;
        }
    }

    subscribeToActiveReports(callback) {
        return onSnapshot(this.reportsCollection, (snapshot) => {
            const reports = [];
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                if (data.status === "active") {
                    reports.push({ id: docSnap.id, ...data });
                }
            });
            callback(reports);
        });
    }

    async upvoteReport(reportId, currentVotes) {
        const ref = doc(db, "reports", reportId);
        return await updateDoc(ref, { upvotes: currentVotes + 1 });
    }
}