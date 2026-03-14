// --- ĐỊA CHỈ NGROK ---
const BASE_URL = "https://eaa8-2001-ee0-4141-611d-f998-7707-f08c-c584.ngrok-free.app"; 

function showMainContent(name) {
    const loginScreen = document.getElementById('login-screen');
    const mainContent = document.getElementById('main-content');
    const welcomeMsg = document.getElementById('welcome-msg');
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    if (welcomeMsg) welcomeMsg.innerText = `Chào bạn, ${name}! 👋`;
}

function handleLogout() { 
    localStorage.clear(); 
    location.reload(); 
}

// Khi trang web load xong, không cần check gì cả, cứ để người dùng dùng luôn
window.onload = () => {
    console.log("Văn phòng Thầy Thọ đã sẵn sàng!");
};

// --- 2. TÍNH NĂNG 1: CHUYỂN LINK ---
async function convertLink() {
    const userLink = document.getElementById('rawLink').value.trim();
    const resDiv = document.getElementById('result');
    if(!userLink) return alert("Dán link đã Thọ ơi!");

    resDiv.style.display = "block";
    resDiv.style.color = "var(--primary-color)";
    
    // Hiển thị thông báo hàng chờ ban đầu
    resDiv.innerHTML = `
        <div class="waiting-box">
            <p>🔍 Đang kết nối với Bot...</p>
            <p style="font-size: 0.9rem; color: #666;">Đang xử lý trong hàng chờ ưu tiên của Thọ.</p>
        </div>
    `;

    try {
        const response = await fetch(`${BASE_URL}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link: userLink })
        });
        
        const data = await response.json();

        if (data.affiliate_link) {
            // Khi thành công, hiện giao diện MUA NGAY và ZALOPULSE
            resDiv.innerHTML = `
                <div class="success-box">
                    ${data.queue_pos > 1 ? `<p style="color:#ff4757; font-size:0.8rem;">Bạn đã được xử lý xong từ vị trí số ${data.queue_pos}</p>` : ''}
                    <p style="color: var(--success-color); font-size: 1.2rem; font-weight: bold;">✅ Chuyển đổi thành công!</p>
                    
                    <a href="${data.affiliate_link}" target="_blank" class="buy-now-btn">
                        <span class="sticker">🔥</span> MUA NGAY - ĐỪNG BỎ LỠ! <span class="sticker">🛒</span>
                    </a>
                    
                    <hr>
                    <div class="commission-info">
                        💰 <b>Hoa hồng của bạn:</b> 4.5% - 15%<br>
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
            
            // Bắn pháo hoa ăn mừng
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 9999
            });
        } else if (data.error) {
            resDiv.innerText = "❌ " + data.error;
        }
    } catch (err) {
        resDiv.innerText = "🚫 Check Ngrok/Server Thọ ơi!";
    }
}

// --- 3. TÍNH NĂNG 2: BÓI TOÁN ---
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
//---------Xử lý ngọn lửa------------------
function updateFireSize() {
    const question = document.getElementById('fortuneQuestion').value.trim();
    const fire = document.getElementById('ghastlyFire');
    
    if (question.length === 0) {
        // Không có chữ thì tắt lửa
        fire.classList.remove('fire-active');
        fire.style.height = "30px";
        return;
    }

    // Nếu có chữ, kích hoạt lửa cháy mờ ảo
    fire.classList.add('fire-active');

    // Công thức tính lửa: càng nhiều chữ lửa càng cao
    // Ví dụ: tối thiểu 30px, tối đa khoảng 150px
    let baseHeight = 30; // Chiều cao lửa ban đầu nhỏ
    let heightFromText = Math.min(question.length * 1.5, 120); // Tăng 1.5px cho mỗi ký tự
    let newHeight = baseHeight + heightFromText;

    fire.style.height = `${newHeight}px`; // Cập nhật chiều cao lửa thực tế
    
    // Càng nhiều chữ lửa càng đỏ hơn cho kịch tính
    if (newHeight > 100) {
        fire.style.background = radial-gradient(circle, #ff1f1f, #a36cf3, transparent);
    } else {
        fire.style.background = radial-gradient(circle, #ff4757, #a36cf3, transparent);
    }
}
