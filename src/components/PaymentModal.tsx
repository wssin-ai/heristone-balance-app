import React, { useState, useEffect } from 'react';
import { PaymentPlan, NewPayment } from '@/types';
import { formatCurrency, parseCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentPlan: PaymentPlan[];
    onAddPayment: (planId: number, payment: { amount: number; date: string; memo: string }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              paymentPlan,
                                                              onAddPayment
                                                          }) => {
    const [selectedPaymentPlanId, setSelectedPaymentPlanId] = useState<number | null>(null);
    const [newPayment, setNewPayment] = useState<NewPayment>({
        amount: '',
        date: formatDate(new Date()),
        memo: ''
    });

    useEffect(() => {
        if (isOpen) {
            setNewPayment({
                amount: '',
                date: formatDate(new Date()),
                memo: ''
            });
            setSelectedPaymentPlanId(null);
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!selectedPaymentPlanId || !newPayment.amount) {
            alert('중도금을 선택하고 납부 금액을 입력해주세요.');
            return;
        }

        const amount = parseCurrency(newPayment.amount);
        onAddPayment(selectedPaymentPlanId, {
            amount,
            date: newPayment.date,
            memo: newPayment.memo
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">납부 추가</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">중도금 선택</label>
                        <select
                            value={selectedPaymentPlanId || ''}
                            onChange={(e) => setSelectedPaymentPlanId(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                            <option value="">중도금을 선택하세요</option>
                            {paymentPlan.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} - {formatCurrency(plan.plannedAmount - plan.paidAmount)} 남음
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">납부 금액</label>
                        <input
                            type="text"
                            value={newPayment.amount}
                            onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="예: 10,000,000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">납부일</label>
                        <input
                            type="date"
                            value={newPayment.date}
                            onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                        <input
                            type="text"
                            value={newPayment.memo}
                            onChange={(e) => setNewPayment(prev => ({ ...prev, memo: e.target.value }))}
                            placeholder="메모를 입력하세요"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        납부 추가
                    </button>
                </div>
            </div>
        </div>
    );
};