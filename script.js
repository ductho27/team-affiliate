// --- ĐỊA CHỈ NGROK ---
const BASE_URL = "https://3ee2-2001-ee0-4141-611d-f998-7707-f08c-c584.ngrok-free.app"; 

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

// --- TÍNH NĂNG 1: CHUYỂN LINK (ĐÃ NÂNG CẤP GỬI STAFF_ID) ---
async function convertLink() {
    const userLink = document.getElementById('rawLink').value.trim();
    const resDiv = document.getElementById('result');
    
    // Lấy mã nhân viên đã lưu lúc đăng nhập
    const currentStaffId = localStorage.getItem('staffId'); 

    if(!userLink) return alert("Dán link đã Thọ ơi!");
    if(!currentStaffId) return alert("Hết phiên đăng nhập, hãy tải lại trang nhé!");

    resDiv.style.display = "block";
    resDiv.style.color = "var(--primary-color)";
    resDiv.innerText = "🔍 Đang điều khiển Bot... chờ xíu nhé!";

    try {
        const response = await fetch(`${BASE_URL}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // GỬI KÈM STAFF_ID SANG PYTHON ĐỂ ĐIỀN VÀO SUB_ID1
            body: JSON.stringify({ 
                link: userLink,
                staff_id: currentStaffId 
            })
        });
        const data = await response.json();

        if (data.affiliate_link) {
            // ... (Giữ nguyên phần hiển thị success-box và confetti của Thọ) ...
            resDiv.innerHTML = `
                <div class="success-box">
                    <p style="color: var(--success-color); font-size: 1.2rem; font-weight: bold;">✅ Chuyển đổi thành công!</p>
                    <a href="${data.affiliate_link}" target="_blank" class="buy-now-btn">
                        <span class="sticker">🔥</span> ẤN MUA NGAY TẠI ĐÂY ĐỂ HOÀN TIỀN!👈 <span class="sticker">🛒</span>
                    </a>
                    <hr>
                    <div class="commission-info">
                        💰 <b>Hoa hồng của bạn:</b> 4.5% - 15% (Mã: ${currentStaffId})<br>
                        <span>Nhấn vào biểu tượng Zalo để nhận thưởng!</span>
                    </div>
                    <a href="https://zalo.me/0328982137" target="_blank" class="zalo-container">
                        <div class="zalo-icon-wrapper">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo">
                        </div>
                        <span class="zalo-text">Nhắn tin cho Admin</span>
                    </a>
                </div>
            `;
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0056b3', '#28a745', '#ffeb3b', '#ff5722'] });
        } else { 
            resDiv.style.color = "var(--danger-color)";
            resDiv.innerText = "❌ Lỗi: " + (data.error || "Thử lại sau"); 
        }
    } catch (err) { 
        resDiv.style.color = "var(--danger-color)";
        resDiv.innerText = "🚫 Check Ngrok/Server Thọ ơi!"; 
    }
}

// --- TÍNH NĂNG: VOUCHER TỰ ĐỘNG ---
async function updateVouchers() {
    const response = await fetch('http://localhost:5000/get_vouchers');
    const vouchers = await response.json();
    
    const container = document.querySelector('.voucher-list');
    container.innerHTML = ''; // Xóa cái cũ đi

    vouchers.forEach(v => {
        container.innerHTML += `
            <div class="voucher-card" onclick="window.open('${v.link}', '_blank')">
                <div class="voucher-left">
                    <i class="fas fa-ticket-alt"></i>
                    <p>SHOPEE</p>
                </div>
                <div class="voucher-right">
                    <div class="voucher-info">
                        <h4>${v.title}</h4>
                        <p>${v.desc}</p>
                        <small>${v.hsd}</small>
                    </div>
                    <button class="btn-save">LƯU MÃ</button>
                </div>
            </div>
        `;
    });
}

// Chạy ngay khi web vừa mở
updateVouchers();

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
