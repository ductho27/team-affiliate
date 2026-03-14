// --- 1. XỬ LÝ ĐĂNG NHẬP ---
async function handleLogin() {
    const staffId = document.getElementById('staffIdInput').value.trim().toUpperCase();
    const msg = document.getElementById('login-msg');

    if (!staffId) {
        msg.innerText = "⚠️ Thọ ơi, hãy nhập mã nhân viên nhé!";
        return;
    }

    try {
        const response = await fetch('employees.json');
        const userList = await response.json();

        if (userList[staffId]) {
            const userName = userList[staffId];
            localStorage.setItem('userName', userName);
            localStorage.setItem('staffId', staffId);
            showMainContent(userName);
        } else {
            msg.innerText = "❌ Mã không tồn tại trong hệ thống!";
        }
    } catch (err) {
        msg.innerText = "⚠️ Lỗi kết nối (Check file employees.json)!";
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

// --- 2. XỬ LÝ TẠO LINK VÀ HIỂN THỊ HOÀN TIỀN ---
function generateLink() {
    const userLink = document.getElementById('rawLink').value.trim();
    const resultBox = document.getElementById('result-box');
    const finalLink = document.getElementById('finalLink');
    const percentDisplay = document.getElementById('percent-amount'); // Chỗ hiển thị %
    const staffId = localStorage.getItem('staffId') || "THO_ADMIN";

    if(!userLink.includes('shopee.vn') && !userLink.includes('shope.ee')) {
        alert("Thọ ơi, dán đúng link Shopee mới chuẩn nhé!");
        return;
    }

    // --- LOGIC TỶ LỆ % NGẪU NHIÊN (Từ 2% đến 4.5%) ---
    // Tạo số ngẫu nhiên có 1 chữ số thập phân trong khoảng [2.0, 4.5]
    const randomPercent = (Math.random() * (4.5 - 2.0) + 2.0).toFixed(1);

    // Hiển thị tỷ lệ phần trăm đã quay trúng
    if (percentDisplay) {
        percentDisplay.innerText = randomPercent + "%";
    }

    // Gắn link kèm mã nhân viên
    let separator = userLink.includes('?') ? '&' : '?';
    const affLink = `${userLink}${separator}utm_content=${staffId}&utm_source=LuckyPercent`;

    finalLink.href = affLink;
    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: 'smooth' });
}

// Kiểm tra phiên đăng nhập khi load trang
window.onload = () => {
    const savedName = localStorage.getItem('userName');
    if (savedName) showMainContent(savedName);
}
