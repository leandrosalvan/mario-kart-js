const personagens = [
    { NOME: "Mario", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3 },
    { NOME: "Peach", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2 },
    { NOME: "Yoshi", VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3 },
    { NOME: "Bowser", VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5 },
    { NOME: "Luigi", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4 },
    { NOME: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5 },
];

const RODADAS = 5;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    const random = Math.random();
    if (random < 0.33) return "RETA";
    if (random < 0.66) return "CURVA";
    return "CONFRONTO";
}

function sortearPersonagens() {
    const copia = [...personagens];
    const sortear = () => copia.splice(Math.floor(Math.random() * copia.length), 1)[0];
    return [{ ...sortear(), PONTOS: 0 }, { ...sortear(), PONTOS: 0 }];
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(
        `${characterName} 🎲 rolou um dado de ${block}: ${diceResult} + ${attribute} = ${diceResult + attribute}`
    );
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= RODADAS; round++) {
        console.log(`🏁 Rodada ${round}`);

        const block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        const diceResult1 = await rollDice();
        const diceResult2 = await rollDice();

        let total1 = 0;
        let total2 = 0;

        if (block === "RETA") {
            total1 = diceResult1 + character1.VELOCIDADE;
            total2 = diceResult2 + character2.VELOCIDADE;
            await logRollResult(character1.NOME, "velocidade", diceResult1, character1.VELOCIDADE);
            await logRollResult(character2.NOME, "velocidade", diceResult2, character2.VELOCIDADE);
        }

        if (block === "CURVA") {
            total1 = diceResult1 + character1.MANOBRABILIDADE;
            total2 = diceResult2 + character2.MANOBRABILIDADE;
            await logRollResult(character1.NOME, "manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRollResult(character2.NOME, "manobrabilidade", diceResult2, character2.MANOBRABILIDADE);
        }

        if (block === "CONFRONTO") {
            const power1 = diceResult1 + character1.PODER;
            const power2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);
            await logRollResult(character1.NOME, "poder", diceResult1, character1.PODER);
            await logRollResult(character2.NOME, "poder", diceResult2, character2.PODER);

            if (power1 > power2 && character2.PONTOS > 0) {
                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 ponto 🐢`);
                character2.PONTOS--;
            } else if (power2 > power1 && character1.PONTOS > 0) {
                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 ponto 🐢`);
                character1.PONTOS--;
            } else {
                console.log(
                    power1 === power2
                        ? "Confronto empatado! Nenhum ponto foi perdido"
                        : "Confronto decidido, mas o perdedor não tinha pontos para perder"
                );
            }
        } else if (total1 > total2) {
            console.log(`${character1.NOME} marcou um ponto!`);
            character1.PONTOS++;
        } else if (total2 > total1) {
            console.log(`${character2.NOME} marcou um ponto!`);
            character2.PONTOS++;
        } else {
            console.log("Empate na rodada! Ninguém pontuou");
        }

        console.log("-----------------------------");
        await esperar(1000);
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado final:");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
    } else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
    } else {
        console.log("\nA corrida terminou em empate! 🤝");
    }
}

(async function main() {
    const [player1, player2] = sortearPersonagens();

    console.log(`🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})();
