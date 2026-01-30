import mysql from "mysql2/promise";

// Parse DATABASE_URL corretamente
const dbUrl = process.env.DATABASE_URL;
const urlMatch = dbUrl.match(
  /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
);

if (!urlMatch) {
  console.error("❌ DATABASE_URL inválida");
  process.exit(1);
}

const [, user, password, host, port, database] = urlMatch;

async function seedLegislation() {
  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    multipleStatements: true,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Create Legislação category
    const [categoryResult] = await connection.query(
      "INSERT INTO categories (name, description, color, `order`, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [
        "Legislação",
        "Principais leis que caem em concursos públicos",
        "#8b5cf6",
        4,
        true,
      ]
    );

    const categoryId = categoryResult.insertId;
    console.log(`✅ Categoria Legislação criada com ID: ${categoryId}`);

    // Get difficulty levels
    const [difficulties] = await connection.query(
      "SELECT id, level FROM difficulty_levels ORDER BY level"
    );

    // Get banks
    const [banks] = await connection.query("SELECT id FROM banks LIMIT 3");

    const bankIds = banks.map((b) => b.id);
    const easyDiffId = difficulties.find((d) => d.level === 1)?.id || 1;
    const mediumDiffId = difficulties.find((d) => d.level === 2)?.id || 2;
    const hardDiffId = difficulties.find((d) => d.level === 3)?.id || 3;

    // Legislation questions
    const questions = [
      {
        categoryId,
        bankId: bankIds[0],
        difficultyId: easyDiffId,
        questionText:
          "De acordo com a Constituição Federal de 1988, qual é o fundamento da República Federativa do Brasil?",
        alternatives: {
          a: "A soberania popular",
          b: "A dignidade da pessoa humana",
          c: "A construção de uma sociedade livre",
          d: "A garantia do desenvolvimento nacional",
          e: "A erradicação da pobreza",
        },
        correctAnswer: "b",
        explanation:
          "Conforme o artigo 1º, inciso III da CF/88, a dignidade da pessoa humana é um dos fundamentos da República Federativa do Brasil.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[1],
        difficultyId: mediumDiffId,
        questionText:
          "A Lei de Responsabilidade Fiscal (Lei Complementar 101/2000) estabelece limites para a despesa com pessoal. Qual é o limite para o Poder Executivo da União?",
        alternatives: {
          a: "40% da receita corrente líquida",
          b: "45% da receita corrente líquida",
          c: "50% da receita corrente líquida",
          d: "55% da receita corrente líquida",
          e: "60% da receita corrente líquida",
        },
        correctAnswer: "c",
        explanation:
          "Conforme o artigo 19 da LRF, o limite para despesa total com pessoal do Poder Executivo da União é 50% da receita corrente líquida.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[2],
        difficultyId: easyDiffId,
        questionText:
          "A Lei de Acesso à Informação (Lei 12.527/2011) garante o direito de acesso a informações públicas. Qual é o prazo máximo para resposta a um pedido de informação?",
        alternatives: {
          a: "5 dias úteis",
          b: "10 dias úteis",
          c: "15 dias úteis",
          d: "20 dias úteis",
          e: "30 dias úteis",
        },
        correctAnswer: "d",
        explanation:
          "De acordo com o artigo 11 da Lei 12.527/2011, o órgão ou entidade pública deve responder ao pedido de informação no prazo de 20 dias úteis.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[0],
        difficultyId: mediumDiffId,
        questionText:
          "A Lei Anticorrupção (Lei 12.846/2013) estabelece responsabilidade objetiva para pessoas jurídicas. Qual é a multa máxima prevista?",
        alternatives: {
          a: "Até 5% do faturamento bruto",
          b: "Até 10% do faturamento bruto",
          c: "Até 15% do faturamento bruto",
          d: "Até 20% do faturamento bruto",
          e: "Até 25% do faturamento bruto",
        },
        correctAnswer: "d",
        explanation:
          "Conforme o artigo 6º da Lei 12.846/2013, a multa administrativa será de até 20% do faturamento bruto da pessoa jurídica.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[1],
        difficultyId: hardDiffId,
        questionText:
          "Segundo a Lei 8.666/93 (Lei de Licitações), qual é o tipo de licitação que oferece maior liberdade ao licitante?",
        alternatives: {
          a: "Concorrência",
          b: "Tomada de preço",
          c: "Convite",
          d: "Concurso",
          e: "Leilão",
        },
        correctAnswer: "a",
        explanation:
          "A concorrência é a modalidade de licitação entre quaisquer interessados que, na fase inicial de habilitação, comprovem possuir os requisitos mínimos de qualificação exigidos.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[2],
        difficultyId: easyDiffId,
        questionText:
          "De acordo com a Constituição Federal, quantos são os direitos sociais reconhecidos?",
        alternatives: {
          a: "5 direitos",
          b: "8 direitos",
          c: "10 direitos",
          d: "12 direitos",
          e: "15 direitos",
        },
        correctAnswer: "b",
        explanation:
          "O artigo 6º da CF/88 lista 8 direitos sociais: educação, saúde, alimentação, trabalho, moradia, transporte, lazer e proteção à maternidade e à infância.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[0],
        difficultyId: mediumDiffId,
        questionText:
          "A Lei de Direito Administrativo estabelece que os atos administrativos devem observar princípios. Qual deles refere-se ao cumprimento de prazos legais?",
        alternatives: {
          a: "Princípio da Legalidade",
          b: "Princípio da Eficiência",
          c: "Princípio da Moralidade",
          d: "Princípio da Publicidade",
          e: "Princípio da Impessoalidade",
        },
        correctAnswer: "b",
        explanation:
          "O Princípio da Eficiência, inserido no artigo 37 da CF/88, exige que a administração pública atue com rapidez, perfeição e rendimento funcional.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[1],
        difficultyId: hardDiffId,
        questionText:
          "Conforme o Código de Ética Profissional do Servidor Público Federal (Decreto 1.171/94), qual é o principal dever do servidor?",
        alternatives: {
          a: "Cumprir horários rigorosamente",
          b: "Ser honesto e íntegro em suas ações",
          c: "Usar uniformes adequados",
          d: "Manter sigilo de informações pessoais",
          e: "Participar de eventos da administração",
        },
        correctAnswer: "b",
        explanation:
          "O Código de Ética estabelece que a honestidade e a integridade são os pilares fundamentais da conduta do servidor público.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[2],
        difficultyId: mediumDiffId,
        questionText:
          "A Lei 9.784/99 (Lei de Processo Administrativo) estabelece direitos do administrado. Qual é o prazo máximo para decisão em processo administrativo?",
        alternatives: {
          a: "15 dias",
          b: "30 dias",
          c: "60 dias",
          d: "90 dias",
          e: "120 dias",
        },
        correctAnswer: "b",
        explanation:
          "De acordo com o artigo 49 da Lei 9.784/99, o órgão competente deve decidir o processo no prazo de 30 dias.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[0],
        difficultyId: easyDiffId,
        questionText:
          "Qual lei regulamenta o acesso a informações públicas no Brasil?",
        alternatives: {
          a: "Lei 12.527/2011",
          b: "Lei 12.846/2013",
          c: "Lei 8.666/1993",
          d: "Lei 9.784/1999",
          e: "Lei Complementar 101/2000",
        },
        correctAnswer: "a",
        explanation:
          "A Lei 12.527/2011 é a Lei de Acesso à Informação que regula o direito de acesso a informações públicas.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[1],
        difficultyId: hardDiffId,
        questionText:
          "De acordo com a Constituição Federal, qual é o prazo de mandato de um Presidente da República?",
        alternatives: {
          a: "2 anos",
          b: "3 anos",
          c: "4 anos",
          d: "5 anos",
          e: "6 anos",
        },
        correctAnswer: "c",
        explanation:
          "Conforme o artigo 82 da CF/88, o Presidente da República é eleito por voto direto e secreto do povo para um mandato de 4 anos.",
        year: 2023,
      },
      {
        categoryId,
        bankId: bankIds[2],
        difficultyId: mediumDiffId,
        questionText:
          "A Lei de Responsabilidade Fiscal proíbe certos atos. Qual deles é expressamente proibido?",
        alternatives: {
          a: "Aumentar despesas de custeio",
          b: "Contratar servidor público",
          c: "Gastar com pessoal acima do limite",
          d: "Realizar investimentos públicos",
          e: "Arrecadar tributos",
        },
        correctAnswer: "c",
        explanation:
          "A LRF proíbe que as despesas com pessoal ultrapassem os limites estabelecidos em lei.",
        year: 2023,
      },
    ];

    // Insert questions
    for (const question of questions) {
      await connection.query(
        `INSERT INTO questions 
        (categoryId, bankId, difficultyId, year, questionText, alternatives, correctAnswer, explanation, isActive, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          question.categoryId,
          question.bankId,
          question.difficultyId,
          question.year,
          question.questionText,
          JSON.stringify(question.alternatives),
          question.correctAnswer,
          question.explanation,
          true,
        ]
      );
    }

    console.log(`✅ ${questions.length} questões de Legislação adicionadas com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao adicionar questões de Legislação:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedLegislation().catch(console.error);
