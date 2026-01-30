
export interface GuestAnswer {
  questionId: number;
  isCorrect: boolean;
  categoryId?: string;
  timestamp: number;
}

const STORAGE_KEY = 'guest_stats';

export const getGuestStats = (): GuestAnswer[] => {
  if (typeof window === 'undefined') return [];
  const stats = localStorage.getItem(STORAGE_KEY);
  try {
    return stats ? JSON.parse(stats) : [];
  } catch (e) {
    console.error('Error parsing guest stats', e);
    return [];
  }
};

export const saveGuestAnswer = (answer: Omit<GuestAnswer, 'timestamp'>) => {
  const stats = getGuestStats();
  // Check if already answered, update if so, or append?
  // Let's simple append for now, but maybe unique by questionId is better for "answered questions" count.
  // If user answers same question twice, should count as 2 answers or update result?
  // Usually stats count attempts.
  const newStats = [...stats, { ...answer, timestamp: Date.now() }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
};

export const calculateGuestStats = () => {
  const stats = getGuestStats();
  const totalAnswered = stats.length;
  const totalCorrect = stats.filter(s => s.isCorrect).length;
  const totalIncorrect = totalAnswered - totalCorrect;
  
  // Category stats
  const categoryStatsMap: Record<string, { total: number, correct: number }> = {};
  stats.forEach(s => {
    const cat = s.categoryId || 'Geral';
    if (!categoryStatsMap[cat]) {
        categoryStatsMap[cat] = { total: 0, correct: 0 };
    }
    categoryStatsMap[cat].total++;
    if (s.isCorrect) categoryStatsMap[cat].correct++;
  });

  const categoryStats = Object.entries(categoryStatsMap).map(([name, stat]) => ({
    categoryId: name, // adapting to match trpc return shape roughly
    totalAnswered: stat.total,
    totalCorrect: stat.correct
  }));

  return {
    totalAnswered,
    totalCorrect,
    totalIncorrect,
    categoryStats
  };
};
