document.addEventListener("DOMContentLoaded", () => {
    
    // --- Screen Management & Global Variables ---
    const splashScreen = document.getElementById('splash-screen');
    const loginScreen = document.getElementById('login-screen');
    const otpScreen = document.getElementById('otp-screen');
    const mainApp = document.getElementById('main-app');
    
    const loginForm = document.getElementById('login-form');
    const otpForm = document.getElementById('otp-form');
    
    let userName = "";
    let userEmail = "";

    // 1. Splash Screen Timer
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    }, 4000);

    // ==========================================
    // BACKEND: STEP 1 - SEND OTP
    // ==========================================
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        userName = document.getElementById('name').value;
        userEmail = document.getElementById('email').value;
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.textContent = "Sending Token... ⏳";
        submitBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, name: userName })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                loginScreen.classList.add('hidden');
                otpScreen.classList.remove('hidden');
            } else {
                alert("Error: " + (data.error || "Could not send OTP."));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Could not connect to the server. Make sure node server.js is running!");
        } finally {
            submitBtn.textContent = "Initialize Session";
            submitBtn.disabled = false;
        }
    });

    const backBtnOtp = document.getElementById('back-btn-otp');
    backBtnOtp.addEventListener('click', () => {
        otpScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });

    // ==========================================
    // BACKEND: STEP 2 - VERIFY OTP
    // ==========================================
    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const otpValue = document.getElementById('otp').value;
        const phoneValue = document.getElementById('phone').value; 
        const submitBtn = otpForm.querySelector('button[type="submit"]');
        
        submitBtn.textContent = "Verifying... ⏳";
        submitBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, otp: otpValue, name: userName, phone: phoneValue })
            });

            const data = await response.json();

            if (response.ok) {
                const firstName = userName.split(' ')[0] || 'User';
                document.getElementById('greeting-name').textContent = `Hi, ${firstName}`;
                const avatars = document.querySelectorAll('.profile-avatar');
                avatars.forEach(av => av.textContent = firstName.charAt(0).toUpperCase());
                
                otpScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
            } else {
                alert("Verification Failed: " + (data.error || "Invalid Token."));
                document.getElementById('otp').value = ""; 
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Could not connect to the server.");
        } finally {
            submitBtn.textContent = "Verify Access";
            submitBtn.disabled = false;
        }
    });

    // --- Dynamic View Switching ---
    const viewDashboard = document.getElementById('view-dashboard');
    const viewReportLost = document.getElementById('view-report-lost');
    const viewReportFound = document.getElementById('view-report-found');
    const viewIntel = document.getElementById('view-intel');
    const viewChat = document.getElementById('view-chat'); 

    const btnReportLost = document.getElementById('btn-report-lost');
    const btnReportFound = document.getElementById('btn-report-found');
    const linkToChat = document.getElementById('link-to-chat'); 
    
    const navLogo = document.getElementById('nav-logo');
    const navDashboard = document.getElementById('nav-dashboard');
    const navIntel = document.getElementById('nav-intel');
    const navChat = document.getElementById('nav-chat');
    
    const backBtnLost = document.getElementById('back-btn-lost');
    const backBtnFound = document.getElementById('back-btn-found');
    const backBtnChat = document.getElementById('back-btn-chat');
    const logoutBtn = document.getElementById('logout-btn');

    function hideAllViews() {
        viewDashboard.classList.add('hidden');
        viewReportLost.classList.add('hidden');
        viewReportFound.classList.add('hidden');
        viewIntel.classList.add('hidden');
        viewChat.classList.add('hidden');
        navDashboard.classList.remove('active');
        navIntel.classList.remove('active');
        document.getElementById('settings-sidebar').classList.add('hidden'); 
    }

    btnReportLost.addEventListener('click', () => { hideAllViews(); viewReportLost.classList.remove('hidden'); });
    btnReportFound.addEventListener('click', () => { hideAllViews(); viewReportFound.classList.remove('hidden'); });
    navIntel.addEventListener('click', () => { hideAllViews(); viewIntel.classList.remove('hidden'); navIntel.classList.add('active'); });
    
    const openChat = () => { hideAllViews(); viewChat.classList.remove('hidden'); };
    navChat.addEventListener('click', openChat);
    linkToChat.addEventListener('click', openChat); 

    const goHome = () => { hideAllViews(); viewDashboard.classList.remove('hidden'); navDashboard.classList.add('active'); };
    
    navLogo.addEventListener('click', goHome);
    navDashboard.addEventListener('click', goHome);
    backBtnLost.addEventListener('click', goHome);
    backBtnFound.addEventListener('click', goHome);
    backBtnChat.addEventListener('click', goHome);

    logoutBtn.addEventListener('click', () => {
        mainApp.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        document.getElementById('otp').value = '';
    });

    // --- PROFILE SETTINGS ---
    const profileTrigger = document.getElementById('profile-trigger');
    const settingsSidebar = document.getElementById('settings-sidebar');
    const closeSettings = document.getElementById('close-settings');
    const profileForm = document.getElementById('profile-edit-form');
    const editAvatarInput = document.getElementById('edit-avatar');

    profileTrigger.addEventListener('click', () => {
        settingsSidebar.classList.remove('hidden');
        document.getElementById('edit-name').value = userName; 
    });

    closeSettings.addEventListener('click', () => { settingsSidebar.classList.add('hidden'); });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userName = document.getElementById('edit-name').value;
        const firstName = userName.split(' ')[0] || 'User';
        document.getElementById('greeting-name').textContent = `Hi, ${firstName}`;
        
        const avatars = document.querySelectorAll('.profile-avatar');
        avatars.forEach(av => av.textContent = firstName.charAt(0).toUpperCase());

        if (editAvatarInput.files && editAvatarInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatars.forEach(av => { av.textContent = ""; av.style.backgroundImage = `url(${e.target.result})`; });
            }
            reader.readAsDataURL(editAvatarInput.files[0]);
        }
        settingsSidebar.classList.add('hidden');
        alert("Profile Successfully Updated!");
    });

    // --- INTEL SCAM CLAIM ---
    const scamBtns = document.querySelectorAll('.btn-scam-claim');
    scamBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const container = this.parentElement;
            this.textContent = "Investigating... ⏳";
            this.style.background = "transparent";
            this.style.border = "1px solid var(--text-muted)";
            this.disabled = true;

            setTimeout(() => {
                this.style.display = 'none'; 
                const statusSpan = document.createElement('span');
                statusSpan.textContent = "Claim Verified: GUILTY";
                statusSpan.style.color = "#ec4899";
                statusSpan.style.fontWeight = "bold";
                statusSpan.style.display = "block";
                statusSpan.style.marginBottom = "8px";
                
                const reportBtn = document.createElement('button');
                reportBtn.textContent = "🚨 Report User";
                reportBtn.className = "card-btn btn-danger";
                reportBtn.style.padding = "6px 12px";
                reportBtn.onclick = () => alert("User reported to authorities. Admin action pending.");
                
                container.appendChild(statusSpan);
                container.appendChild(reportBtn);
            }, 2500);
        });
    });

    // --- INTERACTIVE PEER CHAT ---
    let currentChatRole = 'finder'; 

    const btnBlackmail = document.getElementById('btn-blackmail');
    const peerChatInput = document.getElementById('peer-chat-input');
    const peerChatSend = document.getElementById('peer-chat-send');
    const btnAttach = document.getElementById('btn-attach');
    const attachMenu = document.getElementById('attachment-menu');
    const btnAgreement = document.getElementById('btn-agreement');
    
    const btnSendLocation = document.getElementById('btn-send-location');
    const btnSendPhoto = document.getElementById('btn-send-photo');
    const chatMessagesArea = document.getElementById('chat-messages-area');
    
    const agreementModal = document.getElementById('agreement-modal');
    const agreementModalText = document.getElementById('agreement-modal-text');
    const closeAgreementModal = document.getElementById('close-agreement-modal');

    btnAttach.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        attachMenu.classList.toggle('hidden'); 
    });
    
    document.addEventListener('click', (e) => {
        if(!btnAttach.contains(e.target) && !attachMenu.contains(e.target)) {
            attachMenu.classList.add('hidden');
        }
    });

    btnSendLocation.addEventListener('click', () => {
        const newLoc = prompt("Enter the new meeting location you want to propose:");
        if(newLoc) {
            document.getElementById('chat-agreement-location').innerHTML = `<strong>Proposed Location:</strong> ${newLoc}`;
            const msg = document.createElement('div');
            msg.className = 'message user-message';
            msg.innerHTML = `<strong>You:</strong> 📍 Let's meet at: <strong>${newLoc}</strong>`;
            chatMessagesArea.appendChild(msg);
            chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        }
        attachMenu.classList.add('hidden');
    });

    btnSendPhoto.addEventListener('click', () => {
        const msg = document.createElement('div');
        msg.className = 'message user-message';
        msg.innerHTML = `<strong>You:</strong> <br><div style="width:200px; height:120px; background:rgba(0,0,0,0.5); border-radius:8px; display:flex; align-items:center; justify-content:center; margin-top:8px; border:1px dashed var(--primary);">📸 Photo Attached</div>`;
        chatMessagesArea.appendChild(msg);
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        attachMenu.classList.add('hidden');
    });

    btnAgreement.addEventListener('click', () => {
        if(currentChatRole === 'finder') {
            agreementModalText.textContent = "The Finder has confirmed the agreement!";
        } else {
            agreementModalText.textContent = "The Owner has confirmed the agreement!";
        }
        agreementModal.classList.remove('hidden');
    });

    closeAgreementModal.addEventListener('click', () => { agreementModal.classList.add('hidden'); });

    btnBlackmail.addEventListener('click', () => {
        alert('Blackmail attempt logged. Chat transcripts locked and forwarded to administration.');
        btnBlackmail.textContent = "Locked & Reported";
        btnBlackmail.disabled = true;
        btnBlackmail.style.opacity = "0.5";
        peerChatInput.disabled = true;
        peerChatInput.placeholder = "Chat disabled by security.";
        peerChatSend.disabled = true;
        btnAttach.disabled = true;
        btnAgreement.disabled = true;
    });

    window.switchChatContext = function(role) {
        currentChatRole = role; 
        document.getElementById('chat-contact-finder').classList.remove('active');
        document.getElementById('chat-contact-owner').classList.remove('active');
        
        const headerName = document.getElementById('chat-header-name');
        const agreeLocation = document.getElementById('chat-agreement-location');
        const agreeRole = document.getElementById('chat-agreement-role');
        
        if(role === 'finder') {
            document.getElementById('chat-contact-finder').classList.add('active');
            headerName.textContent = "Finder #8492";
            agreeLocation.innerHTML = "<strong>Location selected by Finder:</strong> Main Library Entrance";
            agreeRole.textContent = "Your Role: Owner";
            chatMessagesArea.innerHTML = `
                <div class="message bot-message" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2);"><strong>Finder:</strong> Hello! I found your XPS laptop.</div>
                <div class="message user-message" style="background: rgba(139, 92, 246, 0.2); border-color: rgba(139, 92, 246, 0.4); color: white;"><strong>You:</strong> Thank you! Does the library entrance work for you?</div>
            `;
        } else if (role === 'owner') {
            document.getElementById('chat-contact-owner').classList.add('active');
            headerName.textContent = "Owner #2214";
            agreeLocation.innerHTML = "<strong>Location you provided:</strong> Bench outside Sahara Hostel";
            agreeRole.textContent = "Your Role: Finder";
            chatMessagesArea.innerHTML = `
                <div class="message user-message" style="background: rgba(139, 92, 246, 0.2); border-color: rgba(139, 92, 246, 0.4); color: white;"><strong>You:</strong> Hi, I found your iPhone. I'll be at the bench outside Sahara Hostel.</div>
                <div class="message bot-message" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2);"><strong>Owner:</strong> I'll be there in 5 minutes! Thank you so much!</div>
            `;
        }
    };


    // ==========================================
    // BACKEND: SECURE ODYSSEY CHATBOT 
    // ==========================================
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    chatbotFab.addEventListener('click', () => { chatbotWindow.classList.remove('hidden'); chatbotFab.style.transform = "scale(0)"; });
    closeChatbot.addEventListener('click', () => { chatbotWindow.classList.add('hidden'); chatbotFab.style.transform = "scale(1)"; });

    function appendMessage(text, isUser, container) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        msgDiv.innerHTML = isUser ? `<strong>You:</strong> ${text}` : `<strong>Odyssey:</strong> ${text}`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight; 
    }

    async function handleChatbotSend() {
        const text = chatbotInput.value.trim();
        if(!text) return;
        appendMessage(text, true, chatbotMessages);
        chatbotInput.value = '';

        const loadingId = "loading-" + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message');
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = "<em>Odyssey is thinking...</em>";
        chatbotMessages.appendChild(loadingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            document.getElementById(loadingId).remove(); 
            
            if(response.ok && data.reply) {
                appendMessage(data.reply, false, chatbotMessages);
            } else {
                appendMessage("I'm sorry, my sensors are offline. Is your backend server running?", false, chatbotMessages);
            }
        } catch (error) {
            document.getElementById(loadingId).remove();
            appendMessage("Error: Could not connect to backend server. Make sure server.js is running.", false, chatbotMessages);
        }
    }

    chatbotSend.addEventListener('click', handleChatbotSend);
    chatbotInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleChatbotSend(); });


    // --- 3D TILT EFFECT ---
    const loginBox = document.getElementById('login-box');
    if(loginBox) {
        loginBox.addEventListener('mousemove', (e) => {
            const rect = loginBox.getBoundingClientRect();
            const x = e.clientX - rect.left; const y = e.clientY - rect.top;  
            const centerX = rect.width / 2; const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -20; 
            const rotateY = ((x - centerX) / centerX) * 20;
            loginBox.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`; 
        });
        loginBox.addEventListener('mouseleave', () => {
            loginBox.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }

    // ==========================================
    // MASSIVELY IMPROVED INTERACTIVE CANVAS LOGIC
    // ==========================================
    const canvas = document.getElementById('interactive-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    
    // Track mouse safely anywhere on the document
    const mouse = { x: undefined, y: undefined, radius: 250 }; 

    function resize() { 
        width = canvas.width = window.innerWidth; 
        height = canvas.height = window.innerHeight; 
    }
    window.addEventListener('resize', resize); 
    resize();
    
    // Guaranteed mouse tracking
    document.addEventListener('mousemove', (e) => { 
        mouse.x = e.clientX; 
        mouse.y = e.clientY; 
    });

    // Clear mouse when leaving the window so particles don't get stuck
    document.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Explosions on click!
    document.addEventListener('mousedown', (e) => { 
        let clickX = e.clientX;
        let clickY = e.clientY;
        for(let i = 0; i < 40; i++) {
            particles.push(new Particle(clickX, clickY, true)); 
        }
    });

    class Particle {
        constructor(x, y, isBlast = false) {
            this.x = x || Math.random() * width; 
            this.y = y || Math.random() * height;
            this.size = Math.random() * 2.5 + 1; 
            this.density = (Math.random() * 30) + 1;
            let speedMult = isBlast ? 8 : 1.5;
            this.vx = (Math.random() - 0.5) * speedMult; 
            this.vy = (Math.random() - 0.5) * speedMult;
            this.isBlast = isBlast; 
            this.life = 100;
        }
        draw() {
            ctx.fillStyle = 'rgba(139, 92, 246, 0.8)'; 
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
            ctx.closePath(); 
            ctx.fill();
        }
        update() {
            this.x += this.vx; 
            this.y += this.vy;
            
            if (!this.isBlast) { 
                if (this.x < 0 || this.x > width) this.vx *= -1; 
                if (this.y < 0 || this.y > height) this.vy *= -1; 
            }
            
            // Mouse Interaction: Magnet & Repel
            if (mouse.x !== undefined && mouse.y !== undefined && !this.isBlast) {
                let dx = mouse.x - this.x; 
                let dy = mouse.y - this.y; 
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance; 
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    // Push particles away smoothly
                    this.x -= (forceDirectionX * force * this.density) * 0.15;
                    this.y -= (forceDirectionY * force * this.density) * 0.15;
                }
            }
        }
    }

    function initParticles() { 
        particles = []; 
        let numParticles = (width * height) / 6000; // Increased density
        for (let i = 0; i < numParticles; i++) particles.push(new Particle()); 
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); 
            particles[i].draw();
            
            if(particles[i].isBlast) { 
                particles[i].life--; 
                if(particles[i].life <= 0) { 
                    particles.splice(i, 1); i--; continue; 
                } 
            }
            
            // Draw connections between nearby particles
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x; 
                let dy = particles[i].y - particles[j].y; 
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100 && !particles[i].isBlast && !particles[j].isBlast) {
                    ctx.beginPath(); 
                    ctx.strokeStyle = `rgba(139, 92, 246, ${1 - distance/100})`; 
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y); 
                    ctx.lineTo(particles[j].x, particles[j].y); 
                    ctx.stroke();
                }
            }
            
            // Draw glowing pink lines to the mouse cursor
            if (mouse.x !== undefined && mouse.y !== undefined) {
                let mdx = particles[i].x - mouse.x; 
                let mdy = particles[i].y - mouse.y; 
                let mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < 200) {
                    ctx.beginPath(); 
                    ctx.strokeStyle = `rgba(236, 72, 153, ${0.8 - mDist/200})`; 
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(particles[i].x, particles[i].y); 
                    ctx.lineTo(mouse.x, mouse.y); 
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    
    initParticles(); 
    animate();
});