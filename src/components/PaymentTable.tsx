import React from 'react';
import {CheckCircle, Plus} from 'lucide-react';
import {PaymentPlan} from '@/types';
import {formatCurrency, parseCurrency} from '@/utils/currency';
import {formatDDay, calculateDDay} from '@/utils/date';
import {EditableCell} from './EditableCell';

interface PaymentTableProps {
    paymentPlan: PaymentPlan[];
    currentDate: Date;
    onOpenPaymentModal: () => void;
    onUpdatePaymentPlan: (id: number, field: keyof PaymentPlan, value: any) => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
                                                              paymentPlan,
                                                              currentDate,
                                                              onOpenPaymentModal,
                                                              onUpdatePaymentPlan
                                                          }) => {
    const handleUpdateField = (id: number, field: keyof PaymentPlan, value: string) => {
        let updatedValue: any = value;

        if (field === 'plannedAmount') {
            updatedValue = parseCurrency(value);
        } else if (field === 'interestRate') {
            updatedValue = parseFloat(value.replace('%', '')) || 0;
        }

        onUpdatePaymentPlan(id, field, updatedValue);
    };

    const totalPlanned = paymentPlan.reduce((sum, plan) => sum + plan.plannedAmount, 0);
    const totalPaid = paymentPlan.reduce((sum, plan) => sum + plan.paidAmount, 0);

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-600"/>
                    <span className="hidden sm:inline">중도금 계획 및 납부 현황</span>
                    <span className="sm:hidden">중도금 현황</span>
                </h2>
                <button
                    onClick={onOpenPaymentModal}
                    className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
                >
                    <Plus className="w-4 h-4"/>
                    <span className="hidden sm:inline">납부 추가</span>
                    <span className="sm:hidden">추가</span>
                </button>
            </div>

            {/* 모바일 버전: 카드 레이아웃 */}
            <div className="block md:hidden space-y-4">
                {paymentPlan.map((plan) => {
                    const dday = calculateDDay(plan.dueDate, currentDate);
                    const isCompleted = plan.paidAmount >= plan.plannedAmount;
                    const isOverdue = dday < 0 && !isCompleted;

                    return (
                        <div key={plan.id} className={`border-2 rounded-lg p-4 ${
                            isCompleted ? 'border-green-200 bg-green-50' :
                                isOverdue ? 'border-red-200 bg-red-50' :
                                    'border-gray-200 bg-white'
                        }`}>
                            {/* 제목과 상태 */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex-1">
                                    <EditableCell
                                        value={plan.name}
                                        onSave={(value) => handleUpdateField(plan.id, 'name', value)}
                                        className="font-semibold text-gray-900"
                                    />
                                </div>
                                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                                    isCompleted ? 'bg-green-100 text-green-800' :
                                        isOverdue ? 'bg-red-100 text-red-800' :
                                            dday <= 30 ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100 text-gray-800'
                                }`}>
                                    {isCompleted ? '완료 ✓' : formatDDay(dday)}
                                </div>
                            </div>

                            {/* 금액 정보 */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">계획금액</label>
                                    <EditableCell
                                        value={formatCurrency(plan.plannedAmount)}
                                        onSave={(value) => handleUpdateField(plan.id, 'plannedAmount', value)}
                                        className="text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">납부금액</label>
                                    <div
                                        className={`text-sm font-semibold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                                        {formatCurrency(plan.paidAmount)}
                                        {isCompleted && <span className="ml-1">✓</span>}
                                    </div>
                                </div>
                            </div>

                            {/* 이자율과 예정일 */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">이자율</label>
                                    <EditableCell
                                        value={`${plan.interestRate}%`}
                                        onSave={(value) => handleUpdateField(plan.id, 'interestRate', value)}
                                        className="text-sm font-medium text-center"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">예정일</label>
                                    <EditableCell
                                        value={plan.dueDate}
                                        onSave={(value) => handleUpdateField(plan.id, 'dueDate', value)}
                                        type="date"
                                        className="text-sm font-medium"
                                    />
                                </div>
                            </div>

                            {/* 메모 */}
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">메모</label>
                                <EditableCell
                                    value={plan.memo}
                                    onSave={(value) => handleUpdateField(plan.id, 'memo', value)}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    );
                })}

                {/* 모바일 총계 */}
                <div className="border-t-2 border-gray-300 bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">총계</span>
                        <div className="text-right">
                            <div className="text-sm text-gray-600">
                                계획: {formatCurrency(totalPlanned)}
                            </div>
                            <div className="text-lg font-bold text-green-600">
                                납부: {formatCurrency(totalPaid)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 데스크톱 버전: 테이블 레이아웃 */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">구분</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">계획금액</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">납부금액</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">이자율</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">예정일</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">D-Day</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">메모</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paymentPlan.map((plan) => {
                        const dday = calculateDDay(plan.dueDate, currentDate);
                        const isCompleted = plan.paidAmount >= plan.plannedAmount;
                        const isOverdue = dday < 0 && !isCompleted;

                        return (
                            <tr key={plan.id}
                                className={`border-b border-gray-100 hover:bg-blue-50 ${isCompleted ? 'bg-green-50' : isOverdue ? 'bg-red-50' : ''}`}>
                                <td className="py-3 px-2">
                                    <EditableCell
                                        value={plan.name}
                                        onSave={(value) => handleUpdateField(plan.id, 'name', value)}
                                    />
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <EditableCell
                                        value={formatCurrency(plan.plannedAmount)}
                                        onSave={(value) => handleUpdateField(plan.id, 'plannedAmount', value)}
                                    />
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <span
                                        className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                                      {formatCurrency(plan.paidAmount)}
                                    </span>
                                    {isCompleted && <span className="ml-2 text-green-600">✓</span>}
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <EditableCell
                                        value={`${plan.interestRate}%`}
                                        onSave={(value) => handleUpdateField(plan.id, 'interestRate', value)}
                                        className="text-center"
                                    />
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <EditableCell
                                        value={plan.dueDate}
                                        onSave={(value) => handleUpdateField(plan.id, 'dueDate', value)}
                                        type="date"
                                    />
                                </td>
                                <td className={`py-3 px-2 text-center font-medium ${isOverdue ? 'text-red-600' : dday <= 30 ? 'text-orange-600' : 'text-gray-600'}`}>
                                    {isCompleted ? '완료' : formatDDay(dday)}
                                </td>
                                <td className="py-3 px-2">
                                    <EditableCell
                                        value={plan.memo}
                                        onSave={(value) => handleUpdateField(plan.id, 'memo', value)}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    <tr className="border-t-2 border-gray-300 bg-green-50">
                        <td className="py-3 px-2 font-bold">총계</td>
                        <td className="py-3 px-2 text-right font-bold">{formatCurrency(totalPlanned)}</td>
                        <td className="py-3 px-2 text-right font-bold text-green-600 text-lg">{formatCurrency(totalPaid)}</td>
                        <td colSpan={4}></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};