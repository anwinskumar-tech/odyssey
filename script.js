document.addEventListener("DOMContentLoaded", () => {
    
    // --- Screen Management ---
    const splashScreen = document.getElementById('splash-screen');
    const loginScreen = document.getElementById('login-screen');
    const otpScreen = document.getElementById('otp-screen');
    const mainApp = document.getElementById('main-app');
    
    const loginForm = document.getElementById('login-form');
    const otpForm = document.getElementById('otp-form');
    let userName = "";

    setTimeout(() => {
        splashScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    }, 4000);

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        userName = document.getElementById('name').value;
        loginScreen.classList.add('hidden');
        otpScreen.classList.remove('hidden');
    });

    const backBtnOtp = document.getElementById('back-btn-otp');
    backBtnOtp.addEventListener('click', () => {
        otpScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });

    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = userName.split(' ')[0] || 'User';
        document.getElementById('greeting-name').textContent = `Hi, ${firstName}`;
        
        const avatars = document.querySelectorAll('.profile-avatar');
        avatars.forEach(av => av.textContent = firstName.charAt(0).toUpperCase());
        
        otpScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
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
    
    // Custom interactions
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

    // Location logic
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

    // Photo Logic
    btnSendPhoto.addEventListener('click', () => {
        const msg = document.createElement('div');
        msg.className = 'message user-message';
        msg.innerHTML = `<strong>You:</strong> <br><div style="width:200px; height:120px; background:rgba(0,0,0,0.5); border-radius:8px; display:flex; align-items:center; justify-content:center; margin-top:8px; border:1px dashed var(--primary);">📸 Photo Attached</div>`;
        chatMessagesArea.appendChild(msg);
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        attachMenu.classList.add('hidden');
    });

    // Agreement Confirmation
    btnAgreement.addEventListener('click', () => {
        if(currentChatRole === 'finder') {
            agreementModalText.textContent = "The Finder has confirmed the agreement!";
        } else {
            agreementModalText.textContent = "The Owner has confirmed the agreement!";
        }
        agreementModal.classList.remove('hidden');
    });

    closeAgreementModal.addEventListener('click', () => { agreementModal.classList.add('hidden'); });

    // Blackmail lock
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

    // Role Switching Context
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


    // --- 3D TILT EFFECT (Significantly Increased) ---
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

    // --- INTERACTIVE CANVAS LOGIC (Significantly Increased Interactions) ---
    const canvas = document.getElementById('interactive-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    const mouse = { x: null, y: null, radius: 250 }; // Greatly increased reaction distance

    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    
    // Track mouse everywhere
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    
    // Huge explosion on click
    window.addEventListener('mousedown', (e) => { for(let i = 0; i < 40; i++) particles.push(new Particle(e.clientX, e.clientY, true)); });

    class Particle {
        constructor(x, y, isBlast = false) {
            this.x = x || Math.random() * width; this.y = y || Math.random() * height;
            this.size = Math.random() * 2 + 1; this.density = (Math.random() * 30) + 1;
            let speedMult = isBlast ? 8 : 1.5;
            this.vx = (Math.random() - 0.5) * speedMult; this.vy = (Math.random() - 0.5) * speedMult;
            this.isBlast = isBlast; this.life = 100;
        }
        draw() {
            ctx.fillStyle = 'rgba(139, 92, 246, 0.8)'; ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.closePath(); ctx.fill();
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (!this.isBlast) { if (this.x < 0 || this.x > width) this.vx *= -1; if (this.y < 0 || this.y > height) this.vy *= -1; }
            
            // Mouse Interaction
            let dx = mouse.x - this.x; let dy = mouse.y - this.y; let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius && !this.isBlast) {
                const forceDirectionX = dx / distance; const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= (forceDirectionX * force * this.density) * 0.15;
                this.y -= (forceDirectionY * force * this.density) * 0.15;
            }
        }
    }

    function initParticles() { particles = []; let numParticles = (width * height) / 7000; for (let i = 0; i < numParticles; i++) particles.push(new Particle()); }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); particles[i].draw();
            if(particles[i].isBlast) { particles[i].life--; if(particles[i].life <= 0) { particles.splice(i, 1); i--; continue; } }
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x; let dy = particles[i].y - particles[j].y; let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100 && !particles[i].isBlast && !particles[j].isBlast) {
                    ctx.beginPath(); ctx.strokeStyle = `rgba(139, 92, 246, ${1 - distance/100})`; ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                }
            }
            if (mouse.x != null) {
                let mdx = particles[i].x - mouse.x; let mdy = particles[i].y - mouse.y; let mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < 200) {
                    ctx.beginPath(); ctx.strokeStyle = `rgba(236, 72, 153, ${0.8 - mDist/200})`; ctx.lineWidth = 1.5;
                    ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    initParticles(); animate();
});