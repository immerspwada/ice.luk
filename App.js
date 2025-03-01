import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css"; // Import the CSS file

function App() {
    const [user, setUser] = useState(null);
    const [iceType, setIceType] = useState("หลอดเล็ก");
    const [quantity, setQuantity] = useState(1);
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState(""); // New state for address
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [orderHistory, setOrderHistory] = useState([]); // New state for order history

    useEffect(() => {
        async function initLIFF() {
            try {
                await liff.init({ 
                    liffId: "2006986568-yjrOkKqm",
                    withLoginOnExternalBrowser: true, // Ensure login on external browser
                    scopes: ["openid", "profile", "chat_message.write"] // Add required scopes
                });
                if (!liff.isLoggedIn()) liff.login();
                const profile = await liff.getProfile();
                setUser(profile);
            } catch (error) {
                console.error("การเริ่มต้น LIFF ล้มเหลว", error);
            }
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
                console.error("เกิดข้อผิดพลาดในการรับพิกัด", error);
                alert("ไม่สามารถรับพิกัดได้");
            });
        } else {
            alert("เบราว์เซอร์ของคุณไม่รองรับการรับพิกัด");
        }
    };

    const validateOrder = () => {
        if (!contactNumber) {
            alert("กรุณาใส่เบอร์ติดต่อ");
            return false;
        }
        if (!address) {
            alert("กรุณาใส่ที่อยู่");
            return false;
        }
        return true;
    };

    const sendOrder = async () => {
        if (!liff.isLoggedIn()) return alert("กรุณาเข้าสู่ระบบก่อนสั่งซื้อ");

        if (!validateOrder()) return;

        const orderMessage = `🧊 ออเดอร์น้ำแข็ง: ${iceType} จำนวน ${quantity} ถุง\n📍 สถานที่: ${address}\n📞 เบอร์ติดต่อ: ${contactNumber}\n🌐 พิกัด: ${location.latitude}, ${location.longitude}`;

        if (!window.confirm(`ยืนยันออเดอร์:\n\n${orderMessage}`)) {
            return;
        }

        if (!liff.isInClient()) {
            return alert("กรุณาเปิดแอปนี้ภายในแอป LINE เพื่อส่งคำสั่งซื้อ");
        }

        try {
            await liff.sendMessages([{ type: "text", text: orderMessage }]);
            alert("ส่งคำสั่งซื้อเรียบร้อยแล้ว! กรุณากดปุ่มกากบาทที่มุมขวาบนเพื่อปิดแอป");

            // Save order to history
            const newOrder = { iceType, quantity, contactNumber, address, location, date: new Date() };
            setOrderHistory([...orderHistory, newOrder]);
        } catch (err) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อความ:", err);
            alert(`เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ: ${err.message}`);
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
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="จำนวนถุง"
                min="1"
                style={{ width: "100%", maxWidth: "300px" }}
            />
            <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="เบอร์ติดต่อ"
                style={{ width: "100%", maxWidth: "300px" }}
            />
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ที่อยู่"
                style={{ width: "100%", maxWidth: "300px" }}
            />
            <button onClick={getLocation} style={{ width: "100%", maxWidth: "300px" }}>รับพิกัด</button>
            <p>พิกัด: {location.latitude}, {location.longitude}</p>
            <button onClick={sendOrder} style={{ width: "100%", maxWidth: "300px" }}>สั่งซื้อน้ำแข็ง</button>
            <h3>ประวัติการสั่งซื้อ</h3>
            <ul>
                {orderHistory.map((order, index) => (
                    <li key={index}>
                        {order.date.toLocaleString()}: {order.iceType} จำนวน {order.quantity} ถุง, ที่อยู่: {order.address}, เบอร์ติดต่อ: {order.contactNumber}, พิกัด: {order.location.latitude}, {order.location.longitude}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
