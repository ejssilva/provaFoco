
import { getDb } from "../server/db";
import { questions, categories, banks, difficultyLevels } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const marianaQuestions = [
  // LÍNGUA PORTUGUESA
  {
    categoryName: "LÍNGUA PORTUGUESA",
    // ... rest of props
    questionText: "“Entretanto, é importante reconhecer que ainda existem desafios a serem enfrentados, como a persistente desigualdade salarial, o preconceito e a sub-representação das mulheres em cargos de liderança...” Assinale a afirmativa cuja estruturação está de acordo com a norma padrão e com o sentido do texto.",
    alternatives: {
      a: "Mediante o cenário atual, as mulheres necessitam reconhecer que, daqui há dez anos, muito terá sido feito, mas a luta ainda estará inacabada.",
      b: "Por décadas foi comum vermos a desigualdade social instaurada, o que não mais é uma realidade...",
      c: "Os direitos no mercado de trabalho têm avançado quando o assunto é uma equiparação justa...",
      d: "Dentre os desafios existentes estão questões econômicas e políticas que requerem continuidade de enfrentamento."
    },
    correctAnswer: "d"
  },
  // ... (I need to update the structure to use categoryName and handle insertion logic)
];

// Wait, I should rewrite the whole file to handle the logic properly.
// I'll assume the same question list but I'll iterate and resolve IDs.

const questionsData = [
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "“Entretanto, é importante reconhecer que ainda existem desafios a serem enfrentados, como a persistente desigualdade salarial, o preconceito e a sub-representação das mulheres em cargos de liderança...” Assinale a afirmativa cuja estruturação está de acordo com a norma padrão e com o sentido do texto.",
    alternatives: {
      a: "Mediante o cenário atual, as mulheres necessitam reconhecer que, daqui há dez anos, muito terá sido feito, mas a luta ainda estará inacabada.",
      b: "Por décadas foi comum vermos a desigualdade social instaurada, o que não mais é uma realidade...",
      c: "Os direitos no mercado de trabalho têm avançado quando o assunto é uma equiparação justa...",
      d: "Dentre os desafios existentes estão questões econômicas e políticas que requerem continuidade de enfrentamento."
    },
    correctAnswer: "d"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "Em “A trajetória das mulheres no mundo do trabalho é marcada por lutas incansáveis...”, a voz verbal empregada demonstra:",
    alternatives: {
      a: "Omissão intencional do agente da ação verbal.",
      b: "Destaque ao agente da ação verbal “mulheres”.",
      c: "Intenção de não destacar o agente da ação verbal.",
      d: "Destaque ao complemento verbal “lutas incansáveis”."
    },
    correctAnswer: "c"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "Os termos destacados mantêm relação sintática equivalente, EXCETO:",
    alternatives: {
      a: "“Elas se dividem entre as funções...”",
      b: "“As mulheres que atuam no mercado de trabalho...”",
      c: "“Ao longo da história, as mulheres enfrentaram e superaram...”",
      d: "“No Dia Internacional da Mulher, é essencial refletirmos...”"
    },
    correctAnswer: "d"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "A expressão “mas também”, com valor aditivo, foi empregada inadequadamente em:",
    alternatives: {
      a: "Ela passava muitas horas vendo séries, mas também lia muitos livros.",
      b: "Apenas gostaria de fazer algumas colocações, mas também já está tarde.",
      c: "Sempre foi não só uma ótima professora, mas também uma grande amiga.",
      d: "Não apenas fizemos o projeto, mas também entregamos tudo antes do prazo."
    },
    correctAnswer: "b"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "Quanto à identificação do signatário das comunicações oficiais:\nI. Será informado nome da autoridade que as expede, sem negrito.\nII. Deverá ser informado o cargo da autoridade.\nIII. Não deverá haver assinatura.\nEstá correto:",
    alternatives: {
      a: "I, II e III.",
      b: "I, apenas.",
      c: "I e II, apenas.",
      d: "II e III, apenas."
    },
    correctAnswer: "c"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "O título “O último homem do planeta terra” sugere:",
    alternatives: {
      a: "Crítica social aos hábitos destrutivos.",
      b: "Relato científico da extinção humana.",
      c: "Cenário futurista de preservação humana.",
      d: "Reflexão filosófica sobre solidão e papel humano."
    },
    correctAnswer: "d"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "A expressão “tão somente” pode ser substituída por:",
    alternatives: {
      a: "Eventualmente.",
      b: "Provavelmente.",
      c: "Exclusivamente.",
      d: "Aleatoriamente."
    },
    correctAnswer: "c"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "Qual palavra apresenta ditongo decrescente?",
    alternatives: {
      a: "Saída.",
      b: "Chiado.",
      c: "Reinado.",
      d: "Espalhado."
    },
    correctAnswer: "c"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "Em “A pior parte foram os objetos pessoais...”, a palavra “pior” é:",
    alternatives: {
      a: "Advérbio.",
      b: "Adjetivo superlativo absoluto sintético.",
      c: "Adjetivo comparativo de superioridade.",
      d: "Adjetivo superlativo absoluto analítico."
    },
    correctAnswer: "c"
  },
  {
    categoryName: "LÍNGUA PORTUGUESA",
    questionText: "Sobre “A vegetação dominava as ruas.”:\nI. “A vegetação” é sujeito agente.\nII. “Dominava” é verbo transitivo direto.\nIII. “As ruas” é objeto indireto.\nEstá correto:",
    alternatives: {
      a: "I, II e III.",
      b: "I e II, apenas.",
      c: "I e III, apenas.",
      d: "II e III, apenas."
    },
    correctAnswer: "b"
  },
  {
    categoryName: "RACIOCÍNIO LÓGICO-MATEMÁTICO",
    questionText: "Sabendo que apenas uma afirmação é falsa:\nI. Fenômeno causado por A.\nII. Não é causado por B.\nIII. É causado por C.\nIV. Não é causado por D.\nConclusão correta:",
    alternatives: {
      a: "Não é causado por A.",
      b: "É causado por B.",
      c: "É causado por C.",
      d: "Não é causado por D."
    },
    correctAnswer: "b"
  },
  {
    categoryName: "RACIOCÍNIO LÓGICO-MATEMÁTICO",
    questionText: "Pedro tomou suplemento por 450 dias consecutivos, começando numa quarta-feira e terminando numa sexta-feira. Quantidade mínima de dias que NÃO tomou:",
    alternatives: {
      a: "0",
      b: "1",
      c: "2",
      d: "3"
    },
    correctAnswer: "b"
  },
  {
    categoryName: "RACIOCÍNIO LÓGICO-MATEMÁTICO",
    questionText: "Distribuição proporcional das 495 peças. Resposta correta:",
    alternatives: {
      a: "175",
      b: "200",
      c: "225",
      d: "250"
    },
    correctAnswer: "b"
  },
  {
    categoryName: "RACIOCÍNIO LÓGICO-MATEMÁTICO",
    questionText: "Após 5 operações usando 3/4 do valor restante e pagando taxa de R$ 24:",
    alternatives: {
      a: "R$ 24.576",
      b: "R$ 28.854",
      c: "R$ 32.768",
      d: "R$ 36.922"
    },
    correctAnswer: "c"
  },
  {
    categoryName: "RACIOCÍNIO LÓGICO-MATEMÁTICO",
    questionText: "124 alunos fazem pelo menos uma atividade: 98 teatro, 86 música, 88 dança. Quantidade mínima que faz as três:",
    alternatives: {
      a: "0",
      b: "12",
      c: "24",
      d: "86"
    },
    correctAnswer: "c"
  }
];

async function getOrCreateCategory(db: any, name: string) {
  const existing = await db.select().from(categories).where(eq(categories.name, name)).limit(1);
  if (existing.length > 0) return existing[0].id;
  
  const result = await db.insert(categories).values({ name, description: name }).returning({ id: categories.id });
  return result[0].id;
}

async function getOrCreateBank(db: any, name: string) {
  const existing = await db.select().from(banks).where(eq(banks.name, name)).limit(1);
  if (existing.length > 0) return existing[0].id;
  
  const result = await db.insert(banks).values({ name }).returning({ id: banks.id });
  return result[0].id;
}

async function getOrCreateDifficulty(db: any, name: string, level: number) {
  const existing = await db.select().from(difficultyLevels).where(eq(difficultyLevels.name, name)).limit(1);
  if (existing.length > 0) return existing[0].id;
  
  const result = await db.insert(difficultyLevels).values({ name, level }).returning({ id: difficultyLevels.id });
  return result[0].id;
}

async function seed() {
  console.log("Seeding Mariana questions...");
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }
  
  try {
    const bankId = await getOrCreateBank(db, "Câmara de Mariana");
    const difficultyId = await getOrCreateDifficulty(db, "Média", 2);
    
    for (const q of questionsData) {
      const categoryId = await getOrCreateCategory(db, q.categoryName);
      
      await db.insert(questions).values({
        categoryId,
        bankId,
        difficultyId,
        category: q.categoryName,
        bank: "Câmara de Mariana",
        difficulty: "Média",
        year: "2024",
        questionText: q.questionText,
        alternatives: q.alternatives,
        correctAnswer: q.correctAnswer
      });
    }
    
    console.log("Successfully seeded 15 questions!");
  } catch (error) {
    console.error("Error seeding questions:", error);
  }
}

seed();
