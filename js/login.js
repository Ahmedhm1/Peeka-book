document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');
    const submitBtn = e.target.querySelector('button');

    // 1. تغيير حالة الزر
    submitBtn.innerText = "⏳ جاري الاتصال...";
    submitBtn.disabled = true;
    errorDiv.style.display = 'none';

    console.log("🚀 جاري إرسال الطلب إلى:", `${CONFIG.API_BASE_URL}/login`);

    try {
        // 2. إرسال الطلب مع الهيدر الضروري لـ Ngrok
        const response = await fetch(`${CONFIG.API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true' // <--- هذا هو الحل لمشاكل الاتصال عبر ngrok
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        console.log("📡 حالة الاستجابة:", response.status);

        // محاولة قراءة الرد كـ JSON
        const data = await response.json();
        console.log("📦 البيانات المستلمة:", data);

        if (data.success) {
            console.log("✅ دخول ناجح! جاري التحويل...");
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = CONFIG.BACKEND_DASHBOARD_URL;
        } else {
            throw new Error(data.message || "بيانات الدخول غير صحيحة");
        }

    } catch (error) {
        console.error("❌ حدث خطأ:", error);
        
        // عرض الخطأ للمستخدم وإعادة تفعيل الزر
        errorDiv.innerText = error.message || "فشل الاتصال بالسيرفر";
        errorDiv.style.display = 'block';
        submitBtn.innerText = "دخول";
        submitBtn.disabled = false;
    }
});