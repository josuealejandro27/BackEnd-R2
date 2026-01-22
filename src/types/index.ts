import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Product {
  category?: string;
  stock?: any;
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

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
}

export interface BankInfo {
  id: string;
  name: string;
  months: number;
  rate: number;
  color: string;
  icon: string;
}

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
  cardLastFour?: string; // Opcional para compatibilidad
}

export interface BankImplementor {
  getName(): string;
  getMonths(): number;
  getInterestRate(): number;
  calculateTotal(amount: number): number;
  calculateMonthlyPayment(total: number): number;
}
