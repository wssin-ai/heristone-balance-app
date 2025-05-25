import React from 'react';
import {Calendar, Trash2} from 'lucide-react';
import {PaymentPlan} from '@/types';
import {formatCurrency} from '@/utils/currency';

interface PaymentHistoryProps {
    paymentPlan: PaymentPlan[];
    onDeletePayment: (planId: number, paymentId: number) => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
                                                                  paymentPlan,
                                                                  onDeletePayment
                                                              }) => {
    const plansWithHistory = paymentPlan.filter(plan => plan.paymentHistory.length > 0);

    if (plansWithHistory.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600"/>
                    납부 상세 내역
                </h3>
                <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300"/>
                    <p>아직 납부 내역이 없습니다.</p>
                    <p className="text-sm">납부 추가 버튼을 눌러 첫 납부를 기록해보세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600"/>
                납부 상세 내역
            </h3>

            <div className="space-y-4">
                {plansWithHistory.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-right py-2 px-2 font-medium text-gray-600">납부금액</th>
                                    <th className="text-center py-2 px-2 font-medium text-gray-600">납부일</th>
                                    <th className="text-left py-2 px-2 font-medium text-gray-600">메모</th>
                                    <th className="text-center py-2 px-2 font-medium text-gray-600">액션</th>
                                </tr>
                                </thead>
                                <tbody>
                                {plan.paymentHistory.map((payment) => (
                                    <tr key={payment.id} className="border-b border-gray-100">
                                        <td className="py-2 px-2 text-right font-semibold text-green-600">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                        <td className="py-2 px-2 text-center">{payment.date}</td>
                                        <td className="py-2 px-2">{payment.memo}</td>
                                        <td className="py-2 px-2 text-center">
                                            <button
                                                onClick={() => onDeletePayment(plan.id, payment.id)}
                                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                title="납부 내역 삭제"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};