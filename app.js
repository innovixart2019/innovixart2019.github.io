// Innovix Art — interacciones de la landing
document.documentElement.classList.add("js");

// Aparición suave al hacer scroll
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observador.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".revelar").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + "ms";
  observador.observe(el);
});

// Espacios del portafolio: si la imagen aún no existe, se muestra el marcador
document.querySelectorAll(".pieza img").forEach((img) => {
  const vaciar = () => img.closest(".pieza").classList.add("vacia");
  if (img.complete && img.naturalWidth === 0) vaciar();
  img.addEventListener("error", vaciar);
});

// Los botones de paquete preseleccionan el servicio en el brief
document.querySelectorAll("[data-servicio]").forEach((btn) => {
  btn.addEventListener("click", () => { document.getElementById("f-servicio").value = btn.dataset.servicio; });
});

// Brief → WhatsApp (sin servidor)
const WHATSAPP = "573197818439";
const form = document.getElementById("form-brief");
const error = document.getElementById("error-brief");

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const obligatorios = ["nombre", "negocio", "servicio", "descripcion"];
  let ok = true;
  obligatorios.forEach((k) => {
    const campo = form.elements[k];
    const vacio = !String(d[k] || "").trim();
    campo.classList.toggle("invalido", vacio);
    if (vacio) ok = false;
  });
  error.hidden = ok;
  if (!ok) { form.querySelector(".invalido").focus(); return; }

  let fecha = "Sin fecha definida";
  if (d.fecha) {
    const [a, m, dia] = d.fecha.split("-");
    fecha = `${dia}/${m}/${a}`;
  }
  const mensaje = [
    "Hola Innovix Art 👋 Este es mi brief:",
    "",
    `*Nombre:* ${d.nombre.trim()}`,
    `*Negocio:* ${d.negocio.trim()}`,
    `*Servicio:* ${d.servicio}`,
    `*Presupuesto:* ${String(d.presupuesto || "").trim() || "Por definir"}`,
    `*Fecha:* ${fecha}`,
    "",
    "*Descripción:*",
    d.descripcion.trim(),
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
});

form.addEventListener("input", (ev) => {
  if (ev.target.classList.contains("invalido") && ev.target.value.trim()) ev.target.classList.remove("invalido");
});
