export interface BankImplementor {
  getName(): string;
  getMonths(): number;
  getInterestRate(): number;
  calculateTotal(amount: number): number;
  calculateMonthlyPayment(total: number): number;
}
