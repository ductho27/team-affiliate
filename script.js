// --- ĐỊA CHỈ NGROK ---
const BASE_URL = "https://f9a0-2001-ee0-4141-611d-e48a-ec6c-798-cb54.ngrok-free.app"; 

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

// Chờ cho đến khi trang tải xong hoàn toàn
window.addEventListener('load', function() {
    createStars();
});

function createStars() {
    const starfield = document.getElementById('starfield');
    const numberOfStars = 15; // Số lượng ngôi sao bạn muốn (tăng lên nếu muốn rực rỡ hơn)

    for (let i = 0; i < numberOfStars; i++) {
        // Tạo một phần tử div mới cho mỗi ngôi sao
        const star = document.createElement('div');
        star.classList.add('star');

        // Kích thước ngẫu nhiên (từ 1px đến 4px) cho xinh xắn
        const size = Math.random() * 3 + 1; 
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Vị trí ngẫu nhiên trên toàn màn hình
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;

        // Thời gian nhấp nháy ngẫu nhiên (từ 2s đến 5s) để tạo sự tự nhiên
        const duration = Math.random() * 3 + 2;
        star.style.animationDuration = `${duration}s`;

        // Độ trễ ngẫu nhiên để các sao không nhấp nháy cùng lúc
        star.style.animationDelay = `${Math.random() * 5}s`;

        // Thêm ngôi sao vào khung chứa
        starfield.appendChild(star);
    }
}

// Hàm tạo UFO bay qua màn hình
function launchUFO() {
    const space = document.getElementById('ufo-space');
    if (!space) return;

    const ufo = document.createElement('div');
    ufo.classList.add('ufo');
    ufo.innerHTML = '🛸';

    // MỞ RỘNG PHẠM VI: Cho phép bay từ 5% đến 95% màn hình
    const randomTop = Math.floor(Math.random() * 90) + 5; 
    ufo.style.top = randomTop + '%';

    // NGẪU NHIÊN HƯỚNG BAY: Lúc từ trái sang, lúc từ phải sang
    const isLeftToRight = Math.random() > 0.5;
    
    if (isLeftToRight) {
        ufo.style.animation = `ufo-fly-right ${Math.random() * 5 + 5}s linear forwards`;
    } else {
        ufo.style.animation = `ufo-fly-left ${Math.random() * 5 + 5}s linear forwards`;
    }

    space.appendChild(ufo);
    setTimeout(() => ufo.remove(), 10000);
}

// Thiết lập thời gian xuất hiện ngẫu nhiên (khoảng 10-20 giây lại có 1 chiếc)
function scheduleUFO() {
    const randomDelay = Math.random() * 20000 + 15000; // 10s đến 20s
    setTimeout(() => {
        launchUFO();
        scheduleUFO(); // Lặp lại lịch trình
    }, randomDelay);
}

// Kích hoạt khi trang web sẵn sàng
window.addEventListener('load', () => {
    scheduleUFO();
});

// Hàm tạo sao chổi rực cháy bay qua màn hình
function launchComet() {
    const space = document.getElementById('comet-space');
    if (!space) return;

    const comet = document.createElement('div');
    comet.classList.add('comet');

    // KÍCH THƯỚC "TO ĐÙNG" NGẪU NHIÊN: Chiều dài từ 100px đến 250px
    const randomWidth = Math.floor(Math.random() * 150) + 100;
    comet.style.width = randomWidth + 'px';
    // Chiều cao tỷ lệ theo chiều dài
    comet.style.height = (randomWidth / 3.75) + 'px'; 
    comet.style.borderRadius = (randomWidth / 7.5) + 'px 0 0 ' + (randomWidth / 7.5) + 'px';

    // VỊ TRÍ XUẤT HIỆN NGẪU NHIÊN theo chiều dọc (mép trên)
    const randomTop = Math.floor(Math.random() * 30) - 10; // Từ -10% đến 20% màn hình
    comet.style.top = randomTop + '%';

    // TỐC ĐỘ BAY NGẪU NHIÊN từ 4s đến 8s (nhanh hơn UFO để tạo cảm giác xé gió)
    const duration = Math.floor(Math.random() * 4) + 4;
    // Gán hiệu ứng bay và thời gian
    comet.style.animation = `comet-fly ${duration}s linear forwards`;

    // Thêm sao chổi vào khung chứa
    space.appendChild(comet);

    // Xóa sao chổi sau khi bay xong để nhẹ trình duyệt
    setTimeout(() => {
        comet.remove();
    }, duration * 1000);
}

// Thiết lập thời gian xuất hiện ngẫu nhiên (LÂU LÂU MỚI CÓ: khoảng 30s đến 1 phút lại có 1 quả)
function scheduleComet() {
    const randomDelay = Math.random() * 30000 + 30000; // 30s đến 60s
    setTimeout(() => {
        launchComet();
        scheduleComet(); // Lặp lại lịch trình
    }, randomDelay);
}

// Kích hoạt khi trang web sẵn sàng
window.addEventListener('load', () => {
    scheduleUFO(); // Giữ lại lịch trình UFO cũ
    scheduleComet(); // Thêm lịch trình sao chổi mới
});
