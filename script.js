// --- ĐỊA CHỈ NGROK ---
const BASE_URL = "https://eaa8-2001-ee0-4141-611d-f998-7707-f08c-c584.ngrok-free.app"; 

// --- XỬ LÝ ĐĂNG NHẬP ---
async function handleLogin() {
    const staffId = document.getElementById('staffIdInput').value.trim().toUpperCase();
    const msg = document.getElementById('login-msg');
    if (!staffId) return msg.innerText = "⚠️ Nhập mã nhân viên Thọ ơi!";

    try {
        const response = await fetch('employees.json');
        const userList = await response.json();
        if (userList[staffId]) {
            localStorage.setItem('userName', userList[staffId]);
            localStorage.setItem('staffId', staffId);
            showMainContent(userList[staffId]);
        } else {
            msg.innerText = "❌ Mã không tồn tại!";
        }
    } catch (err) { 
        msg.innerText = "⚠️ Lỗi: Kiểm tra file employees.json!"; 
    }
}

function showMainContent(name) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('welcome-msg').innerText = `Chào bạn, ${name}! 👋`;
}

function handleLogout() { 
    localStorage.clear(); 
    location.reload(); 
}

window.onload = () => {
    const savedName = localStorage.getItem('userName');
    if (savedName) showMainContent(savedName);
}

// --- TÍNH NĂNG 1: CHUYỂN LINK ---
async function convertLink() {
    const userLink = document.getElementById('rawLink').value.trim();
    const resDiv = document.getElementById('result');
    if(!userLink) return alert("Dán link đã Thọ ơi!");

    resDiv.style.display = "block";
    resDiv.style.color = "var(--primary-color)";
    resDiv.innerText = "🔍 Đang điều khiển Bot... chờ xíu nhé!";

    try {
        const response = await fetch(`${BASE_URL}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link: userLink })
        });
        const data = await response.json();

        if (data.affiliate_link) {
            resDiv.innerHTML = `✅ Xong! <a href="${data.affiliate_link}" target="_blank" style="color: var(--success-color); text-decoration: underline;">Mở Link Affiliate</a>`;
            
            // --- KHU VỰC BẮN PHÁO HOA ---
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0056b3', '#28a745', '#ffeb3b', '#ff5722']
            });
            // ---------------------------

        } else { 
            resDiv.style.color = "var(--danger-color)";
            resDiv.innerText = "❌ Lỗi: " + (data.error || "Thử lại sau"); 
        }
    } catch (err) { 
        resDiv.style.color = "var(--danger-color)";
        resDiv.innerText = "🚫 Check Ngrok/Server Thọ ơi!"; 
    }
}

// --- TÍNH NĂNG 2: BÓI TOÁN ---
async function askMasterTho() {
    const question = document.getElementById('fortuneQuestion').value.trim();
    const resDiv = document.getElementById('fortune-result');
    if(!question) return alert("Hỏi gì đi chứ Thọ!");

    resDiv.style.display = "block";
    resDiv.innerText = "🔮 Thầy Thọ đang gieo quẻ...";

    try {
        const response = await fetch(`${BASE_URL}/fortune`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        const data = await response.json();
        resDiv.innerText = "🔮 " + (data.answer || "Thầy đang suy ngẫm...");
    } catch (err) { 
        resDiv.innerText = "🚫 Thầy đang đi vắng (Check Ngrok)!"; 
    }
}
