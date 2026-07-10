export interface FinancialGoal {
  id: string;
  userId: string;
  targetAmount: number;
  currentSaved: number;
  tuitionTotal: number;
  housingTotal: number;
  booksTotal: number;
  otherExpensesTotal: number;
  targetDate: string;
}

export interface FinancialLog {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: 'scholarship' | 'grant' | 'job' | 'loan' | 'tuition' | 'housing' | 'supplies' | 'other';
  amount: number;
  description: string;
  date: string;
}
