const display = document.getElementById("display");
const expression = document.getElementById("expression");
let current = "0", stored = null, operator = null, fresh = false;
function render() { display.textContent = current; }
function calculate(a,b,op) {
  if (op === "+") return a+b;
  if (op === "−") return a-b;
  if (op === "×") return a*b;
  if (op === "÷") return b === 0 ? null : a/b;
  return b;
}
function tidy(n) {
  if (!Number.isFinite(n)) return "Erro";
  return String(Number(n.toPrecision(12)));
}
function input(v) {
  if ("0123456789".includes(v)) {
    if (fresh || current === "0" || current === "Erro") { current = v; fresh = false; }
    else if (current.length < 15) current += v;
  } else if (v === ".") {
    if (fresh) { current = "0."; fresh = false; }
    else if (!current.includes(".")) current += ".";
  } else if (v === "%") {
    current = tidy(Number(current)/100); fresh = true;
  } else {
    if (operator && !fresh && stored !== null) {
      const result = calculate(stored, Number(current), operator);
      if (result === null) { current = "La bele divide ho zero"; stored=null; operator=null; expression.textContent=""; render(); return; }
      current = tidy(result);
    }
    stored = Number(current); operator = v; fresh = true;
    expression.textContent = `${current} ${v}`;
  }
  render();
}
function equals() {
  if (operator === null || stored === null) return;
  const a=stored, b=Number(current), op=operator, result=calculate(a,b,op);
  expression.textContent = `${a} ${op} ${b} =`;
  current = result === null ? "La bele divide ho zero" : tidy(result);
  stored=null; operator=null; fresh=true; render();
}
document.querySelector(".keys").addEventListener("click", e => {
  const b=e.target.closest("button"); if(!b) return;
  if (b.dataset.action==="clear") { current="0";stored=null;operator=null;fresh=false;expression.textContent="";render(); }
  else if (b.dataset.action==="delete") { current=current.length>1?current.slice(0,-1):"0";render(); }
  else if (b.dataset.action==="equals") equals();
  else if (b.dataset.value) input(b.dataset.value);
});
document.addEventListener("keydown", e => {
  if ("0123456789.".includes(e.key)) input(e.key);
  else if (e.key==="+") input("+");
  else if (e.key==="-") input("−");
  else if (e.key==="*") input("×");
  else if (e.key==="/") { e.preventDefault(); input("÷"); }
  else if (e.key==="Enter" || e.key==="=") equals();
  else if (e.key==="Backspace") { current=current.length>1?current.slice(0,-1):"0";render(); }
  else if (e.key==="Escape") { current="0";stored=null;operator=null;fresh=false;expression.textContent="";render(); }
});
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{}));
