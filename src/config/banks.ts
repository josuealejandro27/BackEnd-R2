// src/config/banks.ts

// ============================================
// 1. IMPLEMENTORS (Bancos)
// ============================================

export interface BankImplementor {
  getName(): string;
  getMonths(): number;
  getInterestRate(): number;
  calculateTotal(amount: number): number;
  calculateMonthlyPayment(total: number): number;
}

export class Banco1 implements BankImplementor {
  getName(): string {
    return "Banco BBVA";
  }
  getMonths(): number {
    return 9;
  }
  getInterestRate(): number {
    return 0.08;
  }
  calculateTotal(amount: number): number {
    return amount * (1 + this.getInterestRate());
  }
  calculateMonthlyPayment(total: number): number {
    return total / this.getMonths();
  }
}

export class Banco2 implements BankImplementor {
  getName(): string {
    return "Banco Santander";
  }
  getMonths(): number {
    return 12;
  }
  getInterestRate(): number {
    return 0.1;
  }
  calculateTotal(amount: number): number {
    return amount * (1 + this.getInterestRate());
  }
  calculateMonthlyPayment(total: number): number {
    return total / this.getMonths();
  }
}

export class Banco3 implements BankImplementor {
  getName(): string {
    return "Banco Banamex";
  }
  getMonths(): number {
    return 18;
  }
  getInterestRate(): number {
    return 0.13;
  }
  calculateTotal(amount: number): number {
    return amount * (1 + this.getInterestRate());
  }
  calculateMonthlyPayment(total: number): number {
    return total / this.getMonths();
  }
}

// ============================================
// 2. DETECTOR DE BANCO POR BIN
// ============================================

export class CardBankDetector {
  private static binMapping: Record<string, () => BankImplementor> = {
    // BBVA (Banco1) - Tarjetas válidas con Luhn
    "450678": () => new Banco1(),
    "491234": () => new Banco1(),
    "434107": () => new Banco1(),

    // Santander (Banco2) - Tarjetas válidas con Luhn
    "523456": () => new Banco2(),
    "548901": () => new Banco2(),
    "542418": () => new Banco2(),

    // Banamex (Banco3) - Tarjetas válidas con Luhn
    "601567": () => new Banco3(),
    "456789": () => new Banco3(),
    "601100": () => new Banco3(),
  };

  static detectBank(cardNumber: string): BankImplementor | null {
    const cleanCard = cardNumber.replace(/[\s-]/g, "");
    if (cleanCard.length < 6) return null;

    const bin = cleanCard.substring(0, 6);
    const bankFactory = this.binMapping[bin];
    return bankFactory ? bankFactory() : null;
  }

  static getBankName(cardNumber: string): string | null {
    const bank = this.detectBank(cardNumber);
    return bank ? bank.getName() : null;
  }

  static isCardSupported(cardNumber: string): boolean {
    return this.detectBank(cardNumber) !== null;
  }
}

// ============================================
// 3. VALIDADOR DE TARJETAS
// ============================================

export class CardValidator {
  static isValidCardNumber(cardNumber: string): boolean {
    const cleanCard = cardNumber.replace(/[\s-]/g, "");

    if (!/^\d+$/.test(cleanCard)) return false;
    if (cleanCard.length < 13 || cleanCard.length > 19) return false;

    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;

    for (let i = cleanCard.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanCard[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  static formatCardNumber(cardNumber: string): string {
    const cleanCard = cardNumber.replace(/[\s-]/g, "");
    return cleanCard.replace(/(\d{4})/g, "$1 ").trim();
  }

  static maskCardNumber(cardNumber: string): string {
    const cleanCard = cardNumber.replace(/[\s-]/g, "");
    if (cleanCard.length < 4) return cleanCard;
    const lastFour = cleanCard.slice(-4);
    return "**** **** **** " + lastFour;
  }
}

// ============================================
// 4. PATRÓN BRIDGE - ABSTRACCIÓN
// ============================================

export interface PaymentScheduleItem {
  number: number;
  date: Date;
  amount: number;
  accumulated: number;
}

export interface PaymentResult {
  bankName: string;
  originalAmount: number;
  interestRate: number;
  totalAmount: number;
  months: number;
  monthlyPayment: number;
  schedule: PaymentScheduleItem[];
  cardLastFour: string;
}

export abstract class PaymentPlan {
  protected bank: BankImplementor;

  constructor(bank: BankImplementor) {
    this.bank = bank;
  }

  abstract processPayment(amount: number, cardNumber: string): PaymentResult;
}

// ============================================
// 5. REFINAMIENTO
// ============================================

export class DeferredPaymentPlan extends PaymentPlan {
  processPayment(amount: number, cardNumber: string): PaymentResult {
    const total = this.bank.calculateTotal(amount);
    const monthlyPayment = this.bank.calculateMonthlyPayment(total);
    const months = this.bank.getMonths();

    const schedule: PaymentScheduleItem[] = [];
    const today = new Date();
    let accumulated = 0;

    for (let i = 1; i <= months; i++) {
      accumulated += monthlyPayment;
      const paymentDate = new Date(today);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      schedule.push({
        number: i,
        date: paymentDate,
        amount: monthlyPayment,
        accumulated: accumulated,
      });
    }

    const cleanCard = cardNumber.replace(/[\s-]/g, "");
    const lastFour = cleanCard.slice(-4);

    return {
      bankName: this.bank.getName(),
      originalAmount: amount,
      interestRate: this.bank.getInterestRate(),
      totalAmount: total,
      months: months,
      monthlyPayment: monthlyPayment,
      schedule: schedule,
      cardLastFour: lastFour,
    };
  }
}

// ============================================
// 6. FUNCIÓN PRINCIPAL
// ============================================

export function processCardPayment(cardNumber: string, amount: number): PaymentResult | { error: string } {
  if (!CardValidator.isValidCardNumber(cardNumber)) {
    return { error: "Número de tarjeta inválido" };
  }

  const bank = CardBankDetector.detectBank(cardNumber);
  if (!bank) {
    return {
      error: "Tarjeta no soportada. Use una tarjeta de BBVA, Santander o Banamex",
    };
  }

  const paymentPlan = new DeferredPaymentPlan(bank);
  return paymentPlan.processPayment(amount, cardNumber);
}
