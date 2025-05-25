export interface ProjectInfo {
    name: string;
    totalAmount: number;
    contractDate: string;
    completionDate: string;
    defaultInterestRate: number;
}

export interface Option {
    id: number;
    name: string;
    price: number;
}

export interface PaymentHistory {
    id: number;
    amount: number;
    date: string;
    memo: string;
}

export interface PaymentPlan {
    id: number;
    name: string;
    plannedAmount: number;
    dueDate: string;
    memo: string;
    interestRate: number;
    paidAmount: number;
    paymentHistory: PaymentHistory[];
}

export interface AppData {
    projectInfo: ProjectInfo;
    options: Option[];
    paymentPlan: PaymentPlan[];
}

export interface NewPayment {
    amount: string;
    date: string;
    memo: string;
}

export interface NextPaymentInfo {
    plan: PaymentPlan;
    dday: number;
}

export interface DashboardStats {
    totalPaid: number;
    remainingAmount: number;
    accruedInterest: number;
    totalEstimatedInterest: number;
    progressPercentage: number;
    totalOptions: number;
}