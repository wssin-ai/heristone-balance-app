import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { NextPaymentInfo, DashboardStats, PaymentPlan, Option } from '@/types';
import { formatCurrency, parseCurrency } from '@/utils/currency';
import { formatDDay } from '@/utils/date';
import { EditableCell } from './EditableCell';

interface SidebarProps {
    nextPaymentInfo: NextPaymentInfo | null;
    stats: DashboardStats;
    paymentPlan: PaymentPlan[];
    options: Option[];
    onUpdateOption: (id: number, field: keyof Option, value: string | number) => void;
    onAddOption: () => void;
    onDeleteOption: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    nextPaymentInfo,
                                                    stats,
                                                    paymentPlan,
                                                    options,
                                                    onUpdateOption,
                                                    onAddOption,
                                                    onDeleteOption
                                                }) => {
    const handleUpdateOption = (id: number, field: keyof Option, value: string) => {
        const updatedValue = field === 'price' ? parseCurrency(value) : value;
        onUpdateOption(id, field, updatedValue);
    };

    const completedPlans = paymentPlan.filter(plan => plan.paidAmount >= plan.plannedAmount).length;

    return (
        <div className="space-y-6">
            {/* 다음 납부 일정 */}
            {nextPaymentInfo && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">다음 납부 일정</h3>
                    <div className="space-y-3">
                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600">다음 납부</p>
                            <p className="text-lg font-bold text-blue-600">{nextPaymentInfo.plan.name}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(nextPaymentInfo.plan.plannedAmount - nextPaymentInfo.plan.paidAmount)}
                            </p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>예정일</span>
                                <span className="font-semibold">{nextPaymentInfo.plan.dueDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>D-Day</span>
                                <span className={`font-semibold ${
                                    nextPaymentInfo.dday <= 0 ? 'text-red-600' :
                                        nextPaymentInfo.dday <= 30 ? 'text-orange-600' : 'text-gray-600'
                                }`}>
                  {formatDDay(nextPaymentInfo.dday)}
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>이자율</span>
                                <span className="text-gray-600">{nextPaymentInfo.plan.interestRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>목적</span>
                                <span className="text-gray-600">{nextPaymentInfo.plan.memo}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 진행률 시각화 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">납부 진행률</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>완료된 중도금</span>
                        <span>{completedPlans} / {paymentPlan.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${stats.progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="text-center">
                        <span className="text-3xl font-bold text-green-600">{stats.progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>납부 완료</span>
                            <span className="font-semibold text-green-600">{formatCurrency(stats.totalPaid)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>남은 금액</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(stats.remainingAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>발생 이자</span>
                            <span className="font-semibold text-red-600">{formatCurrency(stats.accruedInterest)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 옵션 관리 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">옵션 관리</h3>
                    <button
                        onClick={onAddOption}
                        className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                        <Plus className="w-3 h-3" />
                        <span>추가</span>
                    </button>
                </div>
                <div className="space-y-3">
                    {options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <div className="flex-1 mr-2">
                                <EditableCell
                                    value={option.name}
                                    onSave={(value) => handleUpdateOption(option.id, 'name', value)}
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <EditableCell
                                    value={formatCurrency(option.price)}
                                    onSave={(value) => handleUpdateOption(option.id, 'price', value)}
                                    className="text-sm font-semibold text-green-600"
                                />
                                <button
                                    onClick={() => onDeleteOption(option.id)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center font-bold">
                            <span>옵션 총액</span>
                            <span className="text-green-600">{formatCurrency(stats.totalOptions)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 이자 현황 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">이자 현황</h3>
                <div className="space-y-3 text-sm">
                    {paymentPlan.map((plan) => (
                        <div key={plan.id} className="flex justify-between py-2 border-b border-gray-100">
                            <span>{plan.name}</span>
                            <span className="font-semibold text-red-600">{plan.interestRate}%</span>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between py-1">
                            <span>현재까지 발생 이자</span>
                            <span className="font-semibold text-red-600">{formatCurrency(stats.accruedInterest)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>예상 총 이자</span>
                            <span className="font-semibold text-orange-600">{formatCurrency(stats.totalEstimatedInterest)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 빠른 도움말 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💡 사용법</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>1. 납부 기록하기:</strong> "납부 추가" 버튼을 눌러 중도금을 선택하고 납부 금액을 입력하세요.</p>
                    <p><strong>2. 이자율 설정:</strong> 각 중도금별로 개별 이자율을 설정할 수 있습니다.</p>
                    <p><strong>3. 자동 계산:</strong> 입력하면 진행률, 이자, 남은 금액이 자동으로 계산됩니다.</p>
                    <p><strong>4. 편집하기:</strong> 모든 숫자와 텍스트를 클릭하면 바로 수정할 수 있습니다.</p>
                </div>
            </div>
        </div>
    );
};