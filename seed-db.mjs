import { drizzle } from "drizzle-orm/mysql2";
import {
  categories,
  banks,
  difficultyLevels,
  questions,
} from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL || "");

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Limpar dados existentes
    console.log("Limpando dados existentes...");
    // Nota: Você pode descomentar isso se quiser limpar antes de seedar
    // await db.delete(questions);
    // await db.delete(difficultyLevels);
    // await db.delete(banks);
    // await db.delete(categories);

    // Inserir categorias
    console.log("📚 Inserindo categorias...");
    const categoriesData = [
      {
        name: "Português",
        description: "Questões de Português, Interpretação de Texto e Gramática",
        icon: "BookOpen",
        color: "#ef4444",
        order: 1,
      },
      {
        name: "Matemática",
        description: "Questões de Matemática, Lógica e Raciocínio",
        icon: "Calculator",
        color: "#3b82f6",
        order: 2,
      },
      {
        name: "Informática",
        description: "Questões de Informática, Sistemas Operacionais e Redes",
        icon: "Cpu",
        color: "#8b5cf6",
        order: 3,
      },
    ];

    for (const cat of categoriesData) {
      await db.insert(categories).values(cat).onDuplicateKeyUpdate({
        set: cat,
      });
    }

    // Inserir bancas
    console.log("🏢 Inserindo bancas...");
    const banksData = [
      {
        name: "CESPE",
        description: "Centro de Seleção e Promoção de Eventos",
        logo: "https://via.placeholder.com/100",
      },
      {
        name: "FCC",
        description: "Fundação Carlos Chagas",
        logo: "https://via.placeholder.com/100",
      },
      {
        name: "FGV",
        description: "Fundação Getulio Vargas",
        logo: "https://via.placeholder.com/100",
      },
      {
        name: "VUNESP",
        description: "Fundação para o Vestibular da UNESP",
        logo: "https://via.placeholder.com/100",
      },
      {
        name: "IBFC",
        description: "Instituto Brasileiro de Formação e Capacitação",
        logo: "https://via.placeholder.com/100",
      },
    ];

    for (const bank of banksData) {
      await db.insert(banks).values(bank).onDuplicateKeyUpdate({
        set: bank,
      });
    }

    // Inserir níveis de dificuldade
    console.log("📊 Inserindo níveis de dificuldade...");
    const difficultyData = [
      {
        name: "Fácil",
        level: 1,
        color: "#22c55e",
        description: "Questões básicas e introdutórias",
      },
      {
        name: "Médio",
        level: 2,
        color: "#f59e0b",
        description: "Questões intermediárias",
      },
      {
        name: "Difícil",
        level: 3,
        color: "#ef4444",
        description: "Questões avançadas e complexas",
      },
    ];

    for (const diff of difficultyData) {
      await db.insert(difficultyLevels).values(diff).onDuplicateKeyUpdate({
        set: diff,
      });
    }

    // Inserir questões
    console.log("❓ Inserindo questões...");

    const questionsData = [
      // Português - Fácil
      {
        categoryId: 1,
        bankId: 1,
        difficultyId: 1,
        year: 2023,
        questionText:
          "Qual é o sujeito da oração: 'O gato subiu no telhado'?",
        alternatives: {
          a: "O gato",
          b: "No telhado",
          c: "Subiu",
          d: "O telhado",
          e: "Nenhum",
        },
        correctAnswer: "a",
        explanation:
          "O sujeito é o termo que pratica a ação do verbo. Em 'O gato subiu no telhado', 'o gato' é quem realiza a ação de subir.",
        source: "CESPE 2023",
      },
      {
        categoryId: 1,
        bankId: 2,
        difficultyId: 1,
        year: 2023,
        questionText:
          "Qual alternativa completa corretamente a frase: 'Eu _____ muito café todos os dias'?",
        alternatives: {
          a: "bebo",
          b: "bebo",
          c: "beberia",
          d: "beberei",
          e: "bebia",
        },
        correctAnswer: "a",
        explanation:
          "A forma correta é 'bebo' (presente do indicativo), pois a frase indica uma ação habitual no presente.",
        source: "FCC 2023",
      },

      // Português - Médio
      {
        categoryId: 1,
        bankId: 3,
        difficultyId: 2,
        year: 2022,
        questionText:
          "Em qual alternativa a palavra em destaque é um adjunto adverbial?",
        alternatives: {
          a: "Comprei um livro novo.",
          b: "Ela chegou cansada.",
          c: "Estudei muito ontem.",
          d: "O carro é rápido.",
          e: "Ele é um bom aluno.",
        },
        correctAnswer: "c",
        explanation:
          "Em 'Estudei muito ontem', tanto 'muito' quanto 'ontem' são adjuntos adverbiais, modificando o verbo.",
        source: "FGV 2022",
      },

      // Português - Difícil
      {
        categoryId: 1,
        bankId: 1,
        difficultyId: 3,
        year: 2021,
        questionText:
          "Qual é o tipo de oração subordinada presente em: 'Ele trabalha para que sua família tenha uma vida melhor'?",
        alternatives: {
          a: "Subordinada adjetiva",
          b: "Subordinada adverbial final",
          c: "Subordinada substantiva",
          d: "Subordinada adverbial condicional",
          e: "Subordinada adverbial causal",
        },
        correctAnswer: "b",
        explanation:
          "A oração 'para que sua família tenha uma vida melhor' é uma subordinada adverbial final, pois indica a finalidade da ação principal.",
        source: "CESPE 2021",
      },

      // Matemática - Fácil
      {
        categoryId: 2,
        bankId: 2,
        difficultyId: 1,
        year: 2023,
        questionText: "Qual é o resultado de 15 + 23?",
        alternatives: {
          a: "35",
          b: "36",
          c: "37",
          d: "38",
          e: "39",
        },
        correctAnswer: "d",
        explanation: "15 + 23 = 38. Simples adição de números inteiros.",
        source: "FCC 2023",
      },
      {
        categoryId: 2,
        bankId: 3,
        difficultyId: 1,
        year: 2023,
        questionText: "Se um produto custa R$ 100 e tem 20% de desconto, qual é o preço final?",
        alternatives: {
          a: "R$ 70",
          b: "R$ 75",
          c: "R$ 80",
          d: "R$ 85",
          e: "R$ 90",
        },
        correctAnswer: "c",
        explanation:
          "20% de 100 = 20. Preço final = 100 - 20 = R$ 80.",
        source: "FGV 2023",
      },

      // Matemática - Médio
      {
        categoryId: 2,
        bankId: 1,
        difficultyId: 2,
        year: 2022,
        questionText:
          "Qual é a solução da equação: 2x + 5 = 17?",
        alternatives: {
          a: "x = 4",
          b: "x = 5",
          c: "x = 6",
          d: "x = 7",
          e: "x = 8",
        },
        correctAnswer: "c",
        explanation:
          "2x + 5 = 17 → 2x = 12 → x = 6",
        source: "CESPE 2022",
      },

      // Matemática - Difícil
      {
        categoryId: 2,
        bankId: 4,
        difficultyId: 3,
        year: 2021,
        questionText:
          "Qual é a derivada da função f(x) = 3x² + 2x + 1?",
        alternatives: {
          a: "f'(x) = 6x + 2",
          b: "f'(x) = 6x + 1",
          c: "f'(x) = 3x + 2",
          d: "f'(x) = 6x² + 2",
          e: "f'(x) = 3x² + 2",
        },
        correctAnswer: "a",
        explanation:
          "A derivada de 3x² é 6x, a derivada de 2x é 2, e a derivada de 1 é 0. Logo f'(x) = 6x + 2.",
        source: "VUNESP 2021",
      },

      // Informática - Fácil
      {
        categoryId: 3,
        bankId: 5,
        difficultyId: 1,
        year: 2023,
        questionText:
          "Qual é a função principal de um Sistema Operacional?",
        alternatives: {
          a: "Gerenciar hardware e software",
          b: "Apenas executar programas",
          c: "Apenas gerenciar memória",
          d: "Apenas controlar periféricos",
          e: "Apenas armazenar dados",
        },
        correctAnswer: "a",
        explanation:
          "O Sistema Operacional é responsável por gerenciar todos os recursos do computador, incluindo hardware e software.",
        source: "IBFC 2023",
      },
      {
        categoryId: 3,
        bankId: 1,
        difficultyId: 1,
        year: 2023,
        questionText:
          "Qual é a extensão de arquivo para um documento de texto no Windows?",
        alternatives: {
          a: ".doc",
          b: ".txt",
          c: ".pdf",
          d: ".exe",
          e: ".zip",
        },
        correctAnswer: "b",
        explanation:
          "A extensão .txt é a mais comum para arquivos de texto simples. Embora .doc também seja usado para documentos de texto.",
        source: "CESPE 2023",
      },

      // Informática - Médio
      {
        categoryId: 3,
        bankId: 2,
        difficultyId: 2,
        year: 2022,
        questionText:
          "O que é uma rede de computadores?",
        alternatives: {
          a: "Um conjunto de computadores conectados entre si",
          b: "Um único computador",
          c: "Um programa de computador",
          d: "Um tipo de hardware",
          e: "Um sistema operacional",
        },
        correctAnswer: "a",
        explanation:
          "Uma rede de computadores é um conjunto de computadores conectados entre si para compartilhar recursos e informações.",
        source: "FCC 2022",
      },

      // Informática - Difícil
      {
        categoryId: 3,
        bankId: 3,
        difficultyId: 3,
        year: 2021,
        questionText:
          "Qual é a diferença entre IPv4 e IPv6?",
        alternatives: {
          a: "IPv4 usa 32 bits e IPv6 usa 128 bits",
          b: "IPv4 é mais rápido que IPv6",
          c: "IPv6 não suporta roteamento",
          d: "IPv4 é mais seguro que IPv6",
          e: "Não há diferença significativa",
        },
        correctAnswer: "a",
        explanation:
          "IPv4 usa endereços de 32 bits (4 octetos), enquanto IPv6 usa 128 bits, permitindo muito mais endereços únicos.",
        source: "VUNESP 2021",
      },
    ];

    for (const question of questionsData) {
      await db.insert(questions).values(question).onDuplicateKeyUpdate({
        set: question,
      });
    }

    console.log("✅ Seed concluído com sucesso!");
    console.log(`✓ ${categoriesData.length} categorias inseridas`);
    console.log(`✓ ${banksData.length} bancas inseridas`);
    console.log(`✓ ${difficultyData.length} níveis de dificuldade inseridos`);
    console.log(`✓ ${questionsData.length} questões inseridas`);
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seed();
