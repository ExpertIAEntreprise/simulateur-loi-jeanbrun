import type { LeadScore } from "./types";

interface ScoringInput {
  hasEmail: boolean;
  hasPhone: boolean;
  hasName: boolean;
  hasSimulationData: boolean;
  consentPromoter: boolean;
  consentBroker: boolean;
  investmentAmount?: number | undefined;
  monthlyIncome?: number | undefined;
  hasDownPayment?: boolean | undefined;
}

export function calculateLeadScore(input: ScoringInput): LeadScore {
  const completeness = calculateCompleteness(input);
  const financialCapacity = calculateFinancialCapacity(input);
  const projectMaturity = calculateProjectMaturity(input);
  const engagement = calculateEngagement(input);

  const total = Math.round(
    completeness * 0.25 +
    financialCapacity * 0.30 +
    projectMaturity * 0.25 +
    engagement * 0.20
  );

  return {
    total: Math.min(100, Math.max(0, total)),
    breakdown: { completeness, financialCapacity, projectMaturity, engagement },
  };
}

function calculateCompleteness(input: ScoringInput): number {
  let score = 0;
  if (input.hasEmail) score += 30;
  if (input.hasPhone) score += 30;
  if (input.hasName) score += 20;
  if (input.hasSimulationData) score += 20;
  return score;
}

function calculateFinancialCapacity(input: ScoringInput): number {
  let score = 0;
  if (input.investmentAmount && input.investmentAmount > 100000) score += 40;
  else if (input.investmentAmount && input.investmentAmount > 50000) score += 20;
  if (input.monthlyIncome && input.monthlyIncome > 4000) score += 40;
  else if (input.monthlyIncome && input.monthlyIncome > 2500) score += 20;
  if (input.hasDownPayment) score += 20;
  return Math.min(100, score);
}

function calculateProjectMaturity(input: ScoringInput): number {
  let score = 0;
  if (input.hasSimulationData) score += 60;
  if (input.investmentAmount) score += 20;
  if (input.hasDownPayment) score += 20;
  return Math.min(100, score);
}

function calculateEngagement(input: ScoringInput): number {
  let score = 0;
  if (input.consentPromoter) score += 40;
  if (input.consentBroker) score += 40;
  if (input.hasPhone) score += 20;
  return Math.min(100, score);
}
