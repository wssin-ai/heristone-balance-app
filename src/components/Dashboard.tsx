import React from 'react';
import { Calculator, Calendar, PiggyBank, TrendingUp } from 'lucide-react';
import { DashboardStats, PaymentPlan } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface DashboardProps {
    stats: DashboardStats;
    paymentPlan: PaymentPlan[];
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, paymentPlan }) => {
    const totalPayments = paymentPlan.reduce((sum, plan) => sum + plan.paymentHistory.length, 0);
    const incompletePlans = paymentPlan.filter(plan => plan.paidAmount < plan.plannedAmount).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">총 납부한 금액</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalPaid)}</p>
                        <p className="text-xs text-gray-500">{totalPayments}회 납부</p>
                    </div>
                    <PiggyBank className="w-8 h-8 text-green-600" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">남은 납부 금액</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.remainingAmount)}</p>
                        <p className="text-xs text-gray-500">{incompletePlans}개 중도금 남음</p>
                    </div>
                    <Calculator className="w-8 h-8 text-blue-600" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">발생한 이자</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.accruedInterest)}</p>
                        <p className="text-xs text-gray-500">예상 총 이자: {formatCurrency(stats.totalEstimatedInterest)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">진행률</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.progressPercentage.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">옵션: {formatCurrency(stats.totalOptions)}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-600" />
                </div>
            </div>
        </div>
    );
};