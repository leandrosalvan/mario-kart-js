const players = [
  { nome: "Mario", velocidade: 4, manobrabilidade: 3, poder: 3 },
  { nome: "Peach", velocidade: 3, manobrabilidade: 4, poder: 2 },
  { nome: "Yoshi", velocidade: 2, manobrabilidade: 4, poder: 3 },
  { nome: "Bowser", velocidade: 5, manobrabilidade: 2, poder: 5 },
  { nome: "Luigi", velocidade: 3, manobrabilidade: 4, poder: 4 },
  { nome: "Donkey Kong", velocidade: 2, manobrabilidade: 2, poder: 5 },
];

const RODADAS = 5;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const rollDice = () => Math.floor(Math.random() * 6) + 1;

function sortearPlayers() {
  const copia = [...players];
  const escolher = () => copia.splice(Math.floor(Math.random() * copia.length), 1)[0];
  return [{ ...escolher(), pontos: 0 }, { ...escolher(), pontos: 0 }];
}

function sortearBloco() {
  const r = Math.random();
  if (r < 0.33) return "RETA";
  if (r < 0.66) return "CURVA";
  return "CONFRONTO";
}

function jogarDado(p, atributo) {
  const dado = rollDice();
  return { dado, total: dado + p[atributo] };
}

function log(p, atributo, r) {
  console.log(`${p.nome} 🎲 ${atributo}: ${r.dado} + ${p[atributo]} = ${r.total}`);
}

function rodada(p1, p2, bloco) {
  const atributo = { RETA: "velocidade", CURVA: "manobrabilidade", CONFRONTO: "poder" }[bloco];
  const r1 = jogarDado(p1, atributo);
  const r2 = jogarDado(p2, atributo);
  log(p1, atributo, r1);
  log(p2, atributo, r2);

  if (r1.total === r2.total) return console.log("Empate! Ninguém pontua.");
  const venceu = r1.total > r2.total ? p1 : p2;
  const perdeu = venceu === p1 ? p2 : p1;

  if (bloco === "CONFRONTO") {
    perdeu.pontos = Math.max(0, perdeu.pontos - 1);
    console.log(`${perdeu.nome} perdeu o confronto! (-1 ponto)`);
  } else {
    venceu.pontos++;
    console.log(`${venceu.nome} marcou um ponto!`);
  }
}

async function main() {
  const [p1, p2] = sortearPlayers();
  console.log(`🏁🚨 Corrida entre ${p1.nome} e ${p2.nome} começando...\n`);

  for (let i = 1; i <= RODADAS; i++) {
    const bloco = sortearBloco();
    console.log(`🏁 Rodada ${i} - Bloco: ${bloco}`);
    await esperar(1000);
    rodada(p1, p2, bloco);
    console.log("-----------------------------");
    await esperar(1500);
  }

  console.log("Resultado final:");
  await esperar(1000);
  console.log(`${p1.nome}: ${p1.pontos} ponto(s)`);
  console.log(`${p2.nome}: ${p2.pontos} ponto(s)`);
  if (p1.pontos === p2.pontos) console.log("A corrida terminou em empate!");
  else console.log(`🏆 ${p1.pontos > p2.pontos ? p1.nome : p2.nome} venceu a corrida! Parabéns! 🏆`);
}

main();
