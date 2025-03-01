import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css"; // Import the CSS file

function App() {
    const [user, setUser] = useState(null);
    const [iceType, setIceType] = useState("หลอดเล็ก");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    useEffect(() => {
        async function initLIFF() {
            await liff.init({ liffId: "2006986568-yjrOkKqm" });
            if (!liff.isLoggedIn()) liff.login();
            const profile = await liff.getProfile();
            setUser(profile);
        }
        initLIFF();
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            }, (error) => {
                console.error("Error getting location", error);
                alert("ไม่สามารถรับพิกัดได้");
            });
        } else {
            alert("เบราว์เซอร์ของคุณไม่รองรับการรับพิกัด");
        }
    };

    const sendOrder = async () => {
        if (!liff.isLoggedIn()) return alert("กรุณาเข้าสู่ระบบก่อนสั่งซื้อ");

        if (!contactNumber) return alert("กรุณาใส่เบอร์ติดต่อ");

        const orderMessage = `🧊 ออเดอร์น้ำแข็ง: ${iceType}\n📍 สถานที่: บ้านเลขที่ 99/1\n📞 เบอร์ติดต่อ: ${contactNumber}\n🌐 พิกัด: ${location.latitude}, ${location.longitude}`;

        try {
            await liff.sendMessages([{ type: "text", text: orderMessage }]);
            alert("ส่งคำสั่งซื้อเรียบร้อยแล้ว!");
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="App">
            <h2>สั่งซื้อน้ำแข็งผ่าน LINE</h2>
            {user ? <p>สวัสดี {user.displayName}</p> : <p>กำลังโหลดข้อมูล...</p>}
            <select value={iceType} onChange={(e) => setIceType(e.target.value)}>
                <option value="หลอดเล็ก">หลอดเล็ก (40 บาท)</option>
                <option value="หลอดใหญ่">หลอดใหญ่ (80 บาท)</option>
                <option value="น้ำแข็งบด">น้ำแข็งบด (35 บาท)</option>
            </select>
            <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="เบอร์ติดต่อ"
            />
            <button onClick={getLocation}>รับพิกัด</button>
            <p>พิกัด: {location.latitude}, {location.longitude}</p>
            <button onClick={sendOrder}>สั่งซื้อน้ำแข็ง</button>
        </div>
    );
}

export default App;
