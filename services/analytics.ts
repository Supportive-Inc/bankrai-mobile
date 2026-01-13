import { api } from '../config/api';

export interface Analysis {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  content: string;
  recommendation_severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Story {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  summary: string;
  story: string;
  key_stat: string;
}

export interface TransformedStory {
  timeline: string;
  header: string;
  text: string;
  insightValue: string;
}

export interface GetAnalysesParams {
  limit?: number;
  offset?: number;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GetStoriesParams {
  limit?: number;
  offset?: number;
}

export interface Tip {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  content: string;
  potential_savings: string;
}

export interface TransformedTip {
  id: string;
  header: string;
  text: string;
  tag: string;
  highlightLabel: string;
  highLight: string;
  fullSavingsText: string;
}

export interface GetTipsParams {
  limit?: number;
  offset?: number;
}

export interface PlaidTransaction {
  plaid_account_id: string;
  amount: number;
  date: string;
  name: string | null;
  merchant_name: string | null;
  payment_channel: string | null;
  personal_finance_category: string | null;
  currency: string | null;
  pending: boolean;
}

export interface GetTransactionsParams {
  accountId?: string;
  start_date?: string;
  end_date?: string;
}

export interface OverviewMetrics {
  totalSpent: number;
  budgetRemaining: number;
  transactionCount: number;
  savedThisMonth: number;
  percentChanges: {
    totalSpent: number;
    budgetRemaining: number;
    savedThisMonth: number;
  };
}

export interface SpendingTrendData {
  labels: string[];
  datasets: Array<{
    data: number[];
    strokeWidth: number;
  }>;
}

export interface SpendingCategory {
  title: string;
  amount: string;
  percentValue: number;
  type: string;
  iconColor: string;
  iconBackgroundColor: string;
}

class AnalyticsService {

  /**
   * Transform API tip to UI format
   */
  private transformTip(apiTip: Tip): TransformedTip {
    const content = (apiTip.title + ' ' + apiTip.content).toLowerCase();
    let tag = 'General';

    if (content.includes('subscription')) tag = 'Subscriptions';
    else if (content.includes('meal') || content.includes('food') || content.includes('dine') || content.includes('cook') || content.includes('doordash') || content.includes('restaurant') || content.includes('grocery')) tag = 'Food';
    else if (content.includes('gas') || content.includes('transport') || content.includes('uber') || content.includes('lyft') || content.includes('carpool') || content.includes('fuel')) tag = 'Transportation';
    else if (content.includes('insurance')) tag = 'Insurance';
    else if (content.includes('shop') || content.includes('cashback') || content.includes('amazon')) tag = 'Shopping';
    else if (content.includes('internet') || content.includes('utility') || content.includes('bill')) tag = 'Utilities';
    else if (content.includes('entertainment') || content.includes('streaming') || content.includes('netflix')) tag = 'Entertainment';

    const raw = apiTip.potential_savings || 'No savings data';

    // Extract clean savings amount for display
    let highLight = 'Check details';

    const savingsMatch = raw.match(
      /(?:at least|up to|around)?\s*\$?([\d,]+(?:\.\d+)?)\s*(?:–\s*\$?([\d,]+(?:\.\d+)?))?\s*(?:\/ ?|per ?)?(month|week|year|monthly|weekly|yearly)?/i
    );

    if (savingsMatch) {
      const low = savingsMatch[1].replace(/,/g, '');
      const high = savingsMatch[2]?.replace(/,/g, '');
      const periodRaw = savingsMatch[3] || '';
      const period = periodRaw.toLowerCase().includes('month') ? '/month'
                   : periodRaw.toLowerCase().includes('week') ? '/week'
                   : periodRaw.toLowerCase().includes('year') ? '/year' : '';

      let base = high ? `$${low}–$${high}` : `$${low}`;
      if (raw.toLowerCase().includes('at least')) base = `At least ${base}`;
      else if (raw.toLowerCase().includes('up to')) base = `Up to ${base}`;

      highLight = `${base}${period}`;
    } else if (raw.includes('$')) {
      // Last fallback: grab first $-containing part
      const fallback = raw.split('\n')[0].match(/\$[\d",\.]+/);
      highLight = fallback ? fallback[0] : 'See details';
    }

    return {
      id: apiTip.id,
      header: apiTip.title,
      text: apiTip.content,
      tag,
      highlightLabel: 'Potential Savings',
      highLight,
      fullSavingsText: raw.trim(),
    };
  }

  /**
   * Extract insight value from key_stat string
   */
private extractInsightValue(keyStat: string): string {
  // Try to find percentage changes (e.g., "25% Decrease", "18% Increase")
  const percentMatch = keyStat.match(/(\d+)%\s*(Decrease|Increase|decrease|increase)/i);
  if (percentMatch) {
    const value = percentMatch[1];
    const isDecrease = percentMatch[2].toLowerCase().includes('decrease');
    return isDecrease ? `-${value}%` : `+${value}%`;
  }

  // Try to find total spent amount (e.g., "Total Spent: $860.23")
  const totalSpentMatch = keyStat.match(/Total Spent:\s*\$?([\d,]+\.?\d*)/i);
  if (totalSpentMatch) {
    return `$${totalSpentMatch[1]}`;
  }

  // Try to find transaction count (e.g., "Transactions: 38")
  const transactionMatch = keyStat.match(/Transactions:\s*(\d+)/i);
  if (transactionMatch) {
    return transactionMatch[1];
  }

  // Try to find any dollar amount
  const dollarMatch = keyStat.match(/\$[\d,]+\.?\d*/);
  if (dollarMatch) {
    return dollarMatch[0]; // Already has $ symbol
  }

  // Try to find any standalone number that looks like money (has decimals or commas)
  const moneyMatch = keyStat.match(/([\d,]+\.\d{2})/);
  if (moneyMatch) {
    return `$${moneyMatch[1]}`;
  }

  // Try to find any percentage
  const anyPercentMatch = keyStat.match(/\d+%/);
  if (anyPercentMatch) {
    return anyPercentMatch[0];
  }

  // Fallback: return first meaningful part or the whole string if short
  const parts = keyStat.split('|');
  return parts[0].trim().length < 20 ? parts[0].trim() : keyStat.substring(0, 15) + '...';
}

  /**
   * Transform API story to UI format
   */
  private transformStory(apiStory: Story): TransformedStory {
    // Calculate timeline based on created_at
    const createdDate = new Date(apiStory.created_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    let timeline = 'this week';
    if (daysDiff > 7 && daysDiff <= 30) {
      timeline = 'this month';
    } else if (daysDiff > 30) {
      timeline = 'earlier';
    }

    return {
      timeline,
      header: apiStory.title,
      text: apiStory.story || apiStory.summary,
      insightValue: this.extractInsightValue(apiStory.key_stat),
    };
  }

  /**
   * Get all analyses for the authenticated user
   */
  async getAnalyses(params?: GetAnalysesParams): Promise<Analysis[]> {
    try {
      const response = await api.get<Analysis[]>('/analytics/analysis', {
        params: {
          limit: params?.limit,
          offset: params?.offset,
          severity: params?.severity,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analyses:', error);
      throw error;
    }
  }

  /**
   * Get all stories for the authenticated user
   */
  async getStories(params?: GetStoriesParams): Promise<TransformedStory[]> {
    try {
      const response = await api.get<Story[]>('/analytics/stories', {
        params: {
          limit: params?.limit || 20,
          offset: params?.offset || 0,
        },
      });

      const data: Story[] = response.data;
      return data.map(story => this.transformStory(story));
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  /**
   * Get raw stories without transformation
   */
  async getRawStories(params?: GetStoriesParams): Promise<Story[]> {
    try {
      const response = await api.get<Story[]>('/analytics/stories', {
        params: {
          limit: params?.limit || 20,
          offset: params?.offset || 0,
        },
      });
      console.log('raw stories --------', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching raw stories:', error);
      throw error;
    }
  }

  /**
   * Get all tips for the authenticated user
   */
  async getTips(params?: GetTipsParams): Promise<TransformedTip[]> {
    try {
      const response = await api.get<Tip[]>('/analytics/tips', {
        params: {
          limit: params?.limit || 20,
          offset: params?.offset || 0,
        },
      });
      console.log('this is one raw tip data:  ', response.data);
      const data: Tip[] = response.data;
      return data.map(tip => this.transformTip(tip));
    } catch (error) {
      console.error('Error fetching tips:', error);
      throw error;
    }
  }

  /**
   * Get raw tips without transformation
   */
  async getRawTips(params?: GetTipsParams): Promise<Tip[]> {
    try {
      const response = await api.get<Tip[]>('/analytics/tips', {
        params: {
          limit: params?.limit || 20,
          offset: params?.offset || 0,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching raw tips:', error);
      throw error;
    }
  }

  /**
   * Get analyses by severity
   */
  async getAnalysesBySeverity(severity: 'LOW' | 'MEDIUM' | 'HIGH'): Promise<Analysis[]> {
    return this.getAnalyses({ severity });
  }

  /**
   * Get high priority analyses
   */
  async getHighPriorityAnalyses(): Promise<Analysis[]> {
    return this.getAnalysesBySeverity('HIGH');
  }

  /**
   * Get medium priority analyses
   */
  async getMediumPriorityAnalyses(): Promise<Analysis[]> {
    return this.getAnalysesBySeverity('MEDIUM');
  }

  /**
   * Get low priority analyses
   */
  async getLowPriorityAnalyses(): Promise<Analysis[]> {
    return this.getAnalysesBySeverity('LOW');
  }

  /**
   * Get Plaid transactions
   */
  async getTransactions(params?: GetTransactionsParams): Promise<PlaidTransaction[]> {
    try {
        console.log('this is data being sent to get transactions', params);
      const response = await api.get<PlaidTransaction[]>('/plaid/transactions', {
        params: {
          accountId: params?.accountId,
          start_date: params?.start_date,
          end_date: params?.end_date,
        },
      });
  console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Get transactions for a specific time period
   */
  async getTransactionsForPeriod(period: 'week' | '2week' | 'month', userId: string): Promise<PlaidTransaction[]> {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '2week':
        startDate.setDate(endDate.getDate() - 14);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
    }

    return this.getTransactions({
        accountId: userId,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    });
  }

  /**
   * Calculate overview metrics from transactions
   */

calculateOverviewMetrics(
  transactions: PlaidTransaction[],
  previousTransactions: PlaidTransaction[],
  monthlyBudget: number = 2500
): OverviewMetrics {
  // Parse amounts as numbers
  const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const previousTotalSpent = previousTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const budgetRemaining = monthlyBudget - totalSpent;
  const previousBudgetRemaining = monthlyBudget - previousTotalSpent;

  const transactionCount = transactions.length;

  // Estimate savings (simplified)
  const savedThisMonth = budgetRemaining > 0 ? budgetRemaining : 0;
  const previousSaved = previousBudgetRemaining > 0 ? previousBudgetRemaining : 0;

  // Calculate percent changes
  const totalSpentChange = previousTotalSpent > 0
    ? ((totalSpent - previousTotalSpent) / previousTotalSpent) * 100
    : 0;

  const budgetRemainingChange = previousBudgetRemaining > 0
    ? ((budgetRemaining - previousBudgetRemaining) / previousBudgetRemaining) * 100
    : 0;

  const savedChange = previousSaved > 0
    ? ((savedThisMonth - previousSaved) / previousSaved) * 100
    : 0;

  return {
    totalSpent: Math.abs(totalSpent),
    budgetRemaining: Math.max(budgetRemaining, 0),
    transactionCount,
    savedThisMonth,
    percentChanges: {
      totalSpent: Math.round(totalSpentChange),
      budgetRemaining: Math.round(budgetRemainingChange),
      savedThisMonth: Math.round(savedChange),
    },
  };
}

  /**
   * Generate spending trend data for chart
   */
  generateSpendingTrend(transactions: PlaidTransaction[], days: number = 7): SpendingTrendData {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    const dailySpending: { [key: string]: number } = {};
    const labels: string[] = [];

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      dailySpending[dateKey] = 0;

      // Create labels (Mon, Tue, etc.)
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    // Sum transactions by day
    transactions.forEach(transaction => {
      const dateKey = transaction.date.split('T')[0];
      if (dailySpending.hasOwnProperty(dateKey)) {
        dailySpending[dateKey] += Math.abs(transaction.amount);
      }
    });

    const data = Object.values(dailySpending);

    return {
      labels,
      datasets: [
        {
          data: data.length > 0 ? data : [0],
          strokeWidth: 2,
        },
      ],
    };
  }

  /**
   * Categorize transactions and calculate spending by category
   */
  categorizeTransactions(transactions: PlaidTransaction[]): SpendingCategory[] {
    const categoryMap: { [key: string]: { total: number; transactions: PlaidTransaction[] } } = {};

    transactions.forEach(transaction => {
      const category = transaction.personal_finance_category || 'Other';
      if (!categoryMap[category]) {
        categoryMap[category] = { total: 0, transactions: [] };
      }
      categoryMap[category].total += Math.abs(transaction.amount);
      categoryMap[category].transactions.push(transaction);
    });

    const totalSpent = Object.values(categoryMap).reduce((sum, cat) => sum + cat.total, 0);

    // Map categories to UI format with colors
    const categoryColors: { [key: string]: { color: string; backgroundColor: string } } = {
      'FOOD_AND_DRINK': { color: '#f2be2e', backgroundColor: '#f5ead5' },
      'GENERAL_MERCHANDISE': { color: '#037017', backgroundColor: '#d5f5dc' },
      'TRANSPORTATION': { color: '#2793f2', backgroundColor: '#d5e3f5' },
      'GENERAL_SERVICES': { color: '#7635f0', backgroundColor: '#e0d5f5' },
      'ENTERTAINMENT': { color: '#202021', backgroundColor: '#bebdbf' },
      'Other': { color: '#565657', backgroundColor: '#cfcfd4' },
    };

    const categories: SpendingCategory[] = Object.entries(categoryMap)
      .map(([category, data]) => {
        const colors = categoryColors[category] || categoryColors['Other'];
        return {
          title: this.formatCategoryName(category),
          amount: `$${data.total.toFixed(2)}`,
          percentValue: totalSpent > 0 ? Math.round((data.total / totalSpent) * 100) : 0,
          type: category.toLowerCase(),
          iconColor: colors.color,
          iconBackgroundColor: colors.backgroundColor,
        };
      })
      .sort((a, b) => b.percentValue - a.percentValue)
      .slice(0, 6); // Top 6 categories

    return categories;
  }

  /**
   * Format category name for display
   */
  private formatCategoryName(category: string): string {
    if (!category || category === 'null') return 'Other';

    const categoryNames: { [key: string]: string } = {
      'FOOD_AND_DRINK': 'Dining & Coffee',
      'GENERAL_MERCHANDISE': 'Shopping',
      'TRANSPORTATION': 'Transportation',
      'GENERAL_SERVICES': 'Utilities',
      'ENTERTAINMENT': 'Entertainment',
    };

    return categoryNames[category] || category
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
}

export const analyticsService = new AnalyticsService();