import React, { useEffect, useState } from "react";
import liff from "@line/liff";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function initLIFF() {
            await liff.init({ liffId: "2006986568-yjrOkKqm" });
            if (!liff.isLoggedIn()) liff.login();
            const profile = await liff.getProfile();
            setUser(profile);
        }
        initLIFF();
    }, []);

    return (
        <div>
            <h2>สั่งซื้อน้ำแข็งผ่าน LINE</h2>
            {user ? <p>สวัสดี {user.displayName}</p> : <p>กำลังโหลดข้อมูล...</p>}
            <button onClick={() => alert("สั่งซื้อสำเร็จ!")}>สั่งซื้อ 5 ถุง</button>
        </div>
    );
}

export default App;
