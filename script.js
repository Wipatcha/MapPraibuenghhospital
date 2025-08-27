// -----------------------------
// 1. สลับเมนูย่อยพร้อมแอนิเมชัน
// -----------------------------
function toggleSubmenu(id, toggleBtn) {
  const submenu = document.getElementById(id);
  const isExpanded = submenu.classList.contains('show');
  const arrow = toggleBtn.querySelector('.arrow');
  const items = submenu.querySelectorAll('li');

  if (isExpanded) {
    toggleBtn.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('aria-hidden', 'true');
    arrow.style.transform = 'rotate(0deg)';
    items.forEach((li, i) => {
      li.style.transitionDelay = `${(items.length - 1 - i) * 80}ms`;
      li.style.opacity = '0';
      li.style.transform = 'translateY(10px)';
    });
    setTimeout(() => {
      submenu.style.maxHeight = '0';
      submenu.style.padding = '0 10px';
      submenu.classList.remove('show');
    }, 80 * items.length + 300);
  } else {
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
      void li.offsetWidth;
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
// 2. popup แสดงรูปทีละภาพ + ปุ่มเลื่อน
// -----------------------------
let imageList = [];
let currentIndex = 0;
let panzoomInstance = null;

function showPopup(src) {
  imageList = [src];
  currentIndex = 0;
  displayImage();
}

function showPopupWithTwoImages(src1, src2) {
  imageList = [src1, src2];
  currentIndex = 0;
  displayImage();
}

function displayImage() {
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('popup');
  const popupImg = document.getElementById('popupImg');
  const wrapper = document.getElementById('imgWrapper');
  const popupContent = popup.querySelector('.popup-content');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  popupImg.src = imageList[currentIndex];
  popupImg.alt = `รูปภาพ ${imageList[currentIndex].split('/').pop()}`;
  overlay.classList.add('show');
  popup.classList.add('show');

  // แสดง/ซ่อนปุ่มเลื่อน
  if (imageList.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'inline-block';
  }

  // แอนิเมชัน popup
  popup.classList.remove('animated');
  void popup.offsetWidth;
  popup.classList.add('animated');

  // ล้าง panzoom เก่า
  panzoomInstance?.destroy?.();
  panzoomInstance = null;

  popupImg.onload = () => {
    const naturalWidth = popupImg.naturalWidth;
    const naturalHeight = popupImg.naturalHeight;
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    const widthRatio = maxWidth / naturalWidth;
    const heightRatio = maxHeight / naturalHeight;
    const scaleRatio = Math.min(widthRatio, heightRatio, 1);
    const displayWidth = naturalWidth * scaleRatio;
    const displayHeight = naturalHeight * scaleRatio;

    popup.style.width = displayWidth + 20 + 'px';
    popup.style.height = displayHeight + 20 + 'px';
    popupContent.style.width = displayWidth + 'px';
    popupContent.style.height = displayHeight + 'px';

    panzoomInstance = Panzoom(wrapper, {
      contain: 'outside',
      maxScale: 5,
      minScale: 1,
    });
  };
}

function nextImage() {
  if (currentIndex < imageList.length - 1) {
    currentIndex++;
    displayImage();
  }
}

function prevImage() {
  if (currentIndex > 0) {
    currentIndex--;
    displayImage();
  }
}

function closePopup() {
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('popup');
  popup.classList.add('hide');
  setTimeout(() => {
    overlay.classList.remove('show');
    popup.classList.remove('hide');
  }, 300);
}

// -----------------------------
// 3. Escape key ปิด popup
// -----------------------------
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});

// -----------------------------
// 4. toggle full screen
// -----------------------------
function toggleFullScreen() {
  const elem = document.querySelector('.popup-content');
  if (!document.fullscreenElement) {
    elem.requestFullscreen?.() || elem.webkitRequestFullscreen?.() || elem.msRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
  }
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && panzoomInstance) {
    panzoomInstance.reset();
  }
});

// -----------------------------
// 5. dark mode toggle
// -----------------------------
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// -----------------------------
// 6. hover sound effect
// -----------------------------
const hoverSound = new Audio('sounds/hoversound.wav');

function playHoverSound() {
  hoverSound.currentTime = 0;
  hoverSound.play().catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
  const submenuItems = document.querySelectorAll('.submenu li');
  submenuItems.forEach(item => {
    item.addEventListener('mouseenter', playHoverSound);
  });
});

// -----------------------------
// 7. mobile menu toggle
// -----------------------------
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
    setTimeout(() => menu.classList.add('hidden'), 400);
  } else {
    menu.classList.remove('hidden');
    setTimeout(() => menu.classList.add('open'), 10);
  }
}

// -----------------------------
// 8. sidebar toggle
// -----------------------------
function toggleSidebar() {
  document.querySelectorAll('.sidebar').forEach(sidebar => {
    sidebar.classList.toggle('active');
  });
}

// -----------------------------
// 9. ปิด popup เมื่อคลิกพื้นที่ว่าง
// -----------------------------
document.getElementById('overlay').addEventListener('click', function (e) {
  if (e.target === this) {
    closePopup();
  }
});
