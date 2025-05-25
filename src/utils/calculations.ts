import { PaymentPlan, ProjectInfo, Option, DashboardStats, NextPaymentInfo } from '@/types';

export const calculateAccruedInterest = (
    paymentPlan: PaymentPlan[],
    contractDate: string
): number => {
    let totalInterest = 0;
    const contractDateObj = new Date(contractDate);

    paymentPlan.forEach(plan => {
        plan.paymentHistory.forEach(payment => {
            const paymentDate = new Date(payment.date);
            const daysFromContract = Math.floor((paymentDate.getTime() - contractDateObj.getTime()) / (1000 * 60 * 60 * 24));
            const interestForThisPayment = (payment.amount * (plan.interestRate / 100) * daysFromContract) / 365;
            totalInterest += interestForThisPayment;
        });
    });

    return totalInterest;
};

export const calculateTotalEstimatedInterest = (
    paymentPlan: PaymentPlan[],
    contractDate: string
): number => {
    let totalEstimatedInterest = 0;
    const contractDateObj = new Date(contractDate);

    paymentPlan.forEach(plan => {
        const dueDate = new Date(plan.dueDate);
        const totalDays = Math.floor((dueDate.getTime() - contractDateObj.getTime()) / (1000 * 60 * 60 * 24));
        const estimatedInterest = (plan.plannedAmount * (plan.interestRate / 100) * totalDays) / 365;
        totalEstimatedInterest += estimatedInterest;
    });

    return totalEstimatedInterest;
};

export const getNextPaymentInfo = (
    paymentPlan: PaymentPlan[],
    currentDate: Date
): NextPaymentInfo | null => {
    const incompletePlans = paymentPlan.filter(plan => plan.paidAmount + 100001 < plan.plannedAmount);
    if (incompletePlans.length === 0) return null;

    const nextPlan = incompletePlans.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    const nextDate = new Date(nextPlan.dueDate);
    const diffTime = nextDate.getTime() - currentDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return { plan: nextPlan, dday: diffDays };
};

export const calculateDashboardStats = (
    paymentPlan: PaymentPlan[],
    projectInfo: ProjectInfo,
    options: Option[]
): DashboardStats => {
    const totalPaid = paymentPlan.reduce((sum, plan) => sum + plan.paidAmount, 0);
    const remainingAmount = projectInfo.totalAmount - totalPaid;
    const accruedInterest = calculateAccruedInterest(paymentPlan, projectInfo.contractDate);
    const totalEstimatedInterest = calculateTotalEstimatedInterest(paymentPlan, projectInfo.contractDate);
    const progressPercentage = (totalPaid / projectInfo.totalAmount) * 100;
    const totalOptions = options.reduce((sum, option) => sum + option.price, 0);

    return {
        totalPaid,
        remainingAmount,
        accruedInterest,
        totalEstimatedInterest,
        progressPercentage,
        totalOptions
    };
};