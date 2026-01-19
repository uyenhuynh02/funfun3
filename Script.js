const box = document.getElementById("box");
const options = document.querySelectorAll(".option");
const allowedOptionId = "opt1"; // ✅ chỉ opt1 được chọn
let frozen = false;

let audioUnlocked = false;

// Âm thanh
const sfx = new Howl({
  src: ["https://assets.mixkit.co/sfx/preview/mixkit-cartoon-slide-618.mp3"],
  volume: 0.5,
});

box.addEventListener("mousemove", (e) => {
  if (frozen) return;

  const mouseX = e.clientX - box.getBoundingClientRect().left;
  const mouseY = e.clientY - box.getBoundingClientRect().top;

  options.forEach((opt) => {
    const isAllowed = opt.id === allowedOptionId;
    const rect = opt.getBoundingClientRect();
    const centerX =
      rect.left + rect.width / 2 - box.getBoundingClientRect().left;
    const centerY =
      rect.top + rect.height / 2 - box.getBoundingClientRect().top;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const runRadius = 100;
    const reaction = opt.querySelector(".reaction");

    if (!isAllowed && distance < runRadius) {
      const boxWidth = box.clientWidth;
      const boxHeight = box.clientHeight;
      const maxLeft = boxWidth - opt.offsetWidth;
      const maxTop = boxHeight - opt.offsetHeight - 60;

      // 👉 Né nhanh hơn (tăng khoảng cách chạy)
      let moveX = (-dx / distance) * 150;
      let moveY = (-dy / distance) * 150;

      let newLeft = opt.offsetLeft + moveX;
      let newTop = opt.offsetTop + moveY;

      const isStuck =
        newLeft < 0 || newLeft > maxLeft || newTop < 60 || newTop > maxTop;

      if (isStuck) {
        newLeft = Math.floor(Math.random() * (maxLeft - 20));
        newTop = 60 + Math.floor(Math.random() * (maxTop - 60));
        reaction.innerText = "văng rồi 😵";
      } else {
        reaction.innerText = reaction.dataset.text;
      }

      opt.style.left = `${Math.max(0, Math.min(maxLeft, newLeft))}px`;
      opt.style.top = `${Math.max(60, Math.min(maxTop, newTop))}px`;

      reaction.style.opacity = 1;
      sfx.play();

      // Ẩn reaction sau 2s
      clearTimeout(opt._reactionTimeout);
      opt._reactionTimeout = setTimeout(() => {
        reaction.style.opacity = 0;
      }, 2000);
    } else {
      opt.querySelector(".reaction").style.opacity = 0;
    }
  });
});

// Click chọn option đúng
options.forEach((opt) => {
  opt.addEventListener("click", () => {
    if (frozen) return;
    if (opt.id === allowedOptionId) {
      frozen = true;
      // document.getElementById("result").style.display = "block";
      alert("Tuyệt lắm em zai!!");
    } else {
      alert("Không được chọn tui đâu 😖");
    }
  });
});

// Unlock âm thanh sau lần đầu người dùng click
window.addEventListener("click", () => {
  if (!audioUnlocked) {
    const silentUnlock = new Howl({
      src: [
        "https://assets.mixkit.co/sfx/preview/mixkit-cartoon-slide-618.mp3",
      ],
      volume: 0,
    });
    silentUnlock.play(); // mở khóa âm thanh
    audioUnlocked = true;
  }
});