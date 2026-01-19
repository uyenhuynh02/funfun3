const box = document.getElementById("box");
const options = document.querySelectorAll(".option");
const allowedOptionId = "opt1"; // ✅ chỉ opt1 được chọn
let frozen = false;

let audioUnlocked = false;


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

    const runRadius = 150;
    const reaction = opt.querySelector(".reaction");

    if (!isAllowed && distance < runRadius) {
      const boxWidth = box.clientWidth;
      const boxHeight = box.clientHeight;
      const maxLeft = boxWidth - opt.offsetWidth;
      const maxTop = boxHeight - opt.offsetHeight - 60;

      // 👉 Né nhanh hơn (tăng khoảng cách chạy)
      let moveX = (-dx / distance) * 100;
      let moveY = (-dy / distance) * 100;

      let newLeft = opt.offsetLeft + moveX;
      let newTop = opt.offsetTop + moveY;

      const isStuck =
        newLeft < 0 || newLeft > maxLeft || newTop < 60 || newTop > maxTop;

        console.log("isStuck:", isStuck);
      if (isStuck) {
        newLeft = Math.floor(Math.random() * (maxLeft - 20));
        newTop = 60 + Math.floor(Math.random() * (maxTop - 60));
        reaction.innerText = "đừng mà 😵";
      } else {
        reaction.innerText = reaction.dataset.text;
      }

      setTimeout(() => {
        opt.style.left = `${Math.max(0, Math.min(maxLeft, newLeft))}px`;
        opt.style.top = `${Math.max(60, Math.min(maxTop, newTop))}px`;
      }, 100);

      reaction.style.opacity = 1;

      // Ẩn reaction sau 2s
      clearTimeout(opt._reactionTimeout);
      opt._reactionTimeout = setTimeout(() => {
        reaction.style.opacity = 0;
      }, 9000);
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
      document.getElementById("result").style.display = "block";
      document.getElementById("result").style.color = "#ff0000ff"; // Đặt màu đỏ cho text

      // alert("Tuyt zô cùng!!");
    } else {
      alert("Không được chọn tui đâu 😖");
    }
  });
});