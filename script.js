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
// Bói vui
async function askMasterTho() {
    const question = document.getElementById('fortuneQuestion').value.trim();
    const resultDiv = document.getElementById('fortune-result');
    const loading = document.getElementById('fortune-loading');
    
    if (!question) {
        alert("Thầy Thọ chưa thấy thông tin, làm sao thầy bói được!");
        return;
    }

    // Hiển thị trạng thái đang chờ
    resultDiv.style.display = 'none';
    loading.style.display = 'block';

    const apiKey = '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'; // Thay KEY của bạn vào đây

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Hoặc gpt-4 nếu bạn đã nạp nhiều phí
                messages: [{
                    role: "system",
                    content: "Bạn là 'Thầy Thọ', một chuyên gia bói toán vui vẻ, hài hước, thường xuyên khuyên mọi người đi mua sắm trên Shopee để giải vận đen. Hãy trả lời ngắn gọn, phong cách kiếm hiệp hoặc dân gian Việt Nam."
                }, {
                    role: "user",
                    content: question
                }],
                max_tokens: 200
            })
        });

        const data = await response.json();
        const answer = data.choices[0].message.content;

        loading.style.display = 'none';
        resultDiv.innerText = "Thầy Thọ phán: " + answer;
        resultDiv.style.display = 'block';

    } catch (error) {
        loading.style.display = 'none';
        alert("Thầy Thọ đang đi vắng (Lỗi API), Thọ kiểm tra lại nhé!");
        console.error(error);
    }
}
