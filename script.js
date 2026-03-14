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
    } catch (err) { console.error(err); }
}

function handleLogout() { localStorage.clear(); location.reload(); }

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

// --- 3. THẦY THỌ BÓI VUI (HÀM ĐANG BỊ LỖI ĐÂY) ---
async function askMasterTho() {
    const question = document.getElementById('fortuneQuestion').value.trim();
    const resultDiv = document.getElementById('fortune-result');
    const loading = document.getElementById('fortune-loading');
    if (!question) return alert("Nhập câu hỏi đã Thọ ơi!");

    resultDiv.style.display = 'none';
    loading.style.display = 'block';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `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` // NHỚ THAY KEY ALL PERMISSIONS NHÉ
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "system", content: "Bạn là Thầy Thọ bói toán hài hước, khuyên mua Shopee."}, {role: "user", content: question}]
            })
        });
        const data = await response.json();
        loading.style.display = 'none';
        resultDiv.innerText = "Thầy Thọ phán: " + (data.choices[0].message.content);
        resultDiv.style.display = 'block';
    } catch (error) {
        loading.style.display = 'none';
        alert("Thầy Thọ đang bận, thử lại sau nhé!");
    }
}

// Kiểm tra khi load trang
window.onload = () => {
    if (localStorage.getItem('userName')) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('welcome-msg').innerText = `Chào bạn, ${localStorage.getItem('userName')}! 👋`;
    }
}
