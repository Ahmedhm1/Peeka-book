document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("error");
    const submitBtn = e.target.querySelector("button");

    submitBtn.innerText = "⏳ جاري الاتصال...";
    submitBtn.disabled = true;
    errorDiv.style.display = "none";

    // تأكد أن المسار مطابق لما في السيرفر وهو /api/login
    const LOGIN_URL = `${CONFIG.API_BASE_URL}/api/login`;

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({ email, password }),
            // هذه الخاصية هي المسؤولة عن تخزين الـ Session Cookie القادم من السيرفر
            credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
            // تخزين بيانات المستخدم للاستخدام السريع في الواجهة
            localStorage.setItem("user", JSON.stringify(data.user));

            // التحويل للوحة التحكم
            window.location.href =
                "https://ahmedhm1.github.io/Peeka-book/dashboard.html";
        } else {
            throw new Error(data.message || "بيانات الدخول غير صحيحة");
        }
    } catch (error) {
        errorDiv.innerText = error.message || "فشل الاتصال بالسيرفر";
        errorDiv.style.display = "block";
        submitBtn.innerText = "دخول";
        submitBtn.disabled = false;
    }
});
