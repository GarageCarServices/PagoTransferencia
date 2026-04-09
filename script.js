(function () {
  const toast = document.querySelector("[data-toast]");
  const copyButtons = document.querySelectorAll("[data-copy-value]");
  let toastTimer = null;

  function fallbackCopy(text) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "absolute";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.focus();
    helper.select();
    helper.setSelectionRange(0, helper.value.length);
    document.execCommand("copy");
    document.body.removeChild(helper);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    fallbackCopy(text);
  }

  function showToast(message) {
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  copyButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const value = button.getAttribute("data-copy-value");
      const label = button.getAttribute("data-copy-label") || "Dato";
      const state = button.querySelector(".copy-state");

      try {
        await copyText(value);
        button.classList.add("copied");
        if (state) {
          state.textContent = "Copiado";
        }
        showToast(label + " copiado");

        window.setTimeout(function () {
          button.classList.remove("copied");
          if (state) {
            state.textContent = "Toca para copiar";
          }
        }, 1400);
      } catch (error) {
        showToast("No se pudo copiar. Intenta nuevamente.");
      }
    });
  });
})();
