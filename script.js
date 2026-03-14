// --- 1. XỬ LÝ ĐĂNG NHẬP ---
async function handleLogin() {
    const staffId = document.getElementById('staffIdInput').value.trim().toUpperCase();
    if (!staffId) return alert("Nhập mã nhân viên Thọ ơi!");
    try {
        const response = await fetch('employees.json');
        const userList = await response.json();
        if (userList[staffId]) {
            localStorage.setItem('userName', userList[staffId]);
            localStorage.setItem('staffId', staffId);
            location.reload();
        } else { alert("Mã không đúng!"); }
    } catch (err) { console.error("Lỗi login:", err); }
}

function handleLogout() { 
    localStorage.clear(); 
    location.reload(); 
}

// --- 2. TẠO LINK VÀ % NGẪU NHIÊN ---
function generateLink() {
    const userLink = document.getElementById('rawLink').value.trim();
    const resultBox = document.getElementById('result-box');
    const percentDisplay = document.getElementById('percent-amount');
    const staffId = localStorage.getItem('staffId') || "THO_ADMIN";

    if(!userLink.includes('shopee.vn') && !userLink.includes('shope.ee')) return alert("Dán link Shopee Thọ ơi!");

    const randomPercent = (Math.random() * (4.5 - 2.0) + 2.0).toFixed(1);
    if (percentDisplay) percentDisplay.innerText = randomPercent + "%";

    document.getElementById('finalLink').href = `${userLink}${userLink.includes('?') ? '&' : '?'}utm_content=${staffId}&utm_source=Lucky`;
    resultBox.style.display = "block";
}

// --- 3. THẦY THỌ BÓI VUI (DÙNG GOOGLE GEMINI) ---
async function askMasterTho() {
    const question = document.getElementById('fortuneQuestion').value.trim();
    const resultDiv = document.getElementById('fortune-result');
    const loading = document.getElementById('fortune-loading');
    
    if (!question) return alert("Nhập câu hỏi đã Thọ ơi!");

    resultDiv.style.display = 'none';
    loading.style.display = 'block';

    // THỌ DÁN KEY GOOGLE GEMINI VÀO ĐÂY NHÉ
    const API_KEY = "AIzaSyAIOz-0PxZcUqwzx9VROA1Hfcn95bjRH28"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Bạn là 'Thầy Thọ', một thầy bói vui tính. Trả lời hài hước bằng tiếng Việt về câu hỏi: ${question}. Cuối câu hãy khuyên họ mua Shopee giải hạn.`
                    }]
                }]
            })
        });

        const data = await response.json();
        loading.style.display = 'none';

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const answer = data.candidates[0].content.parts[0].text;
            resultDiv.innerText = "🔮 Thầy Thọ phán: " + answer;
            resultDiv.style.display = 'block';
        } else {
            alert("Thầy Thọ đang suy ngẫm, Thọ thử lại nhé!");
        }

    } catch (error) {
        loading.style.display = 'none';
        alert("Thầy Thọ đang đi vắng, Thọ kiểm tra mạng hoặc Key nhé!");
        console.error("Lỗi Gemini:", error);
    }
}

// Kiểm tra khi load trang
window.onload = () => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('welcome-msg').innerText = `Chào bạn, ${savedName}! 👋`;
    }
}
