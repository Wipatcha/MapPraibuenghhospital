// -----------------------------
// 1. สลับเมนูย่อยพร้อมแอนิเมชัน
// -----------------------------
function toggleSubmenu(id, toggleBtn) {
  const submenu = document.getElementById(id);
  const isExpanded = submenu.classList.contains('show');
  const arrow = toggleBtn.querySelector('.arrow');
  const items = submenu.querySelectorAll('li');

  if (isExpanded) {
    // ซ่อนเมนูย่อย
    toggleBtn.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('aria-hidden', 'true');
    arrow.style.transform = 'rotate(0deg)';

    items.forEach((li, i) => {
      li.style.transitionDelay = `${(items.length - 1 - i) * 80}ms`;
      li.style.opacity = '0';
      li.style.transform = 'translateY(10px)';
    });

    const totalDelay = 80 * items.length + 300;
    setTimeout(() => {
      submenu.style.maxHeight = '0';
      submenu.style.padding = '0 10px';
      submenu.classList.remove('show');
    }, totalDelay);
  } else {
    // แสดงเมนูย่อย
    submenu.classList.add('show');
    toggleBtn.setAttribute('aria-expanded', 'true');
    submenu.setAttribute('aria-hidden', 'false');
    arrow.style.transform = 'rotate(90deg)';

    submenu.style.maxHeight = submenu.scrollHeight + 'px';
    submenu.style.padding = '10px';

    items.forEach((li) => {
      li.style.opacity = '0';
      li.style.transform = 'translateY(10px)';
      li.style.transition = 'none';
      void li.offsetWidth; // รีเฟรช CSS เพื่อรีเซ็ต transition
    });

    items.forEach((li, i) => {
      setTimeout(() => {
        li.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }
}

// -----------------------------
// 2. ระบบแสดง popup (1 รูป)
// -----------------------------
let panzoomInstance = null;
function showPopup(src) {
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('popup');
  const img1 = document.getElementById('popupImg1');
  const img2 = document.getElementById('popupImg2');

  // แสดงเฉพาะ img1
  img1.parentElement.style.display = 'block';
  img2.parentElement.style.display = 'none';
  img1.src = src;
  img1.alt = `รูปภาพ ${src.split('/').pop()}`;

  overlay.classList.add('show');
  popup.classList.add('show');

  // เคลียร์ panzoom เก่าก่อน
  if (panzoomInstance) panzoomInstance.dispose();

  img1.onload = () => {
    panzoomInstance = Panzoom(img1.parentElement, {
      contain: 'outside',
      maxScale: 5,
      minScale: 1,
      startScale: 1,
    });
  };
}

// -----------------------------
// 3. popup แบบ 2 รูป
// -----------------------------
function showPopupWithTwoImages(src1, src2) {
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('popup');
  const img1 = document.getElementById('popupImg1');
  const img2 = document.getElementById('popupImg2');

  img1.src = src1;
  img2.src = src2;
  img1.alt = `รูปภาพ ${src1.split('/').pop()}`;
  img2.alt = `รูปภาพ ${src2.split('/').pop()}`;

  img1.parentElement.style.display = 'block';
  img2.parentElement.style.display = 'block';

  overlay.classList.add('show');
  popup.classList.add('show');

  if (panzoomInstance) panzoomInstance.dispose();

  img1.onload = () => {
    panzoomInstance = Panzoom(img1.parentElement, {
      contain: 'outside',
      maxScale: 5,
      minScale: 1,
      startScale: 1,
    });
  };

  img2.onload = () => {
    Panzoom(img2.parentElement, {
      contain: 'outside',
      maxScale: 5,
      minScale: 1,
      startScale: 1,
    });
  };
}

// -----------------------------
// 4. ปิด popup
// -----------------------------
function hidePopup() {
  document.getElementById('popup').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('popupImg1').src = '';
  document.getElementById('popupImg2').src = '';
  if (panzoomInstance) {
    panzoomInstance.dispose();
    panzoomInstance = null;
  }
   // ออกจาก fullscreen ถ้ายังอยู่ใน fullscreen
  if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// ปิด popup เมื่อกดปุ่ม Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hidePopup();
});

// -----------------------------
// 5. Fullscreen toggle
// -----------------------------
function toggleFullScreen() {
  const elem = document.querySelector('.popup-content');
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// ฟัง event fullscreenchange เพื่อรีเซ็ต style
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    console.log('Fullscreen mode exited');

    // รีเซ็ต transform หรือ scale ถ้าใช้ panzoom
    if (panzoomInstance) {
      panzoomInstance.reset();  // หรือ dispose + สร้างใหม่ตามต้องการ
    }

    // รีเซ็ต style popup-content
    const popupContent = document.querySelector('.popup-content');
    if (popupContent) {
      popupContent.style.width = '';
      popupContent.style.height = '';
      popupContent.style.transform = '';
    }
  }
});


// -----------------------------
// 6. Dark mode
// -----------------------------
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}
// สร้าง Audio object สำหรับเสียง hover
const hoverSound = new Audio('sounds/hoversound.wav');

// ฟังก์ชันเล่นเสียงตอน hover
function playHoverSound() {
  hoverSound.currentTime = 0; // เล่นซ้ำตั้งแต่ต้น
  hoverSound.play().catch(() => {
    // เงียบถ้า browser block autoplay
  });
}

// เพิ่ม event listener ให้กับ submenu ทุกตัวตอนโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
  const submenuItems = document.querySelectorAll('.submenu li');
  submenuItems.forEach(item => {
    item.addEventListener('mouseenter', playHoverSound);
  });
});


function toggleSidebar() {
  document.querySelectorAll('.sidebar').forEach(sidebar => {
    sidebar.classList.toggle('active');
  });
}
