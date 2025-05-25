import React, { useState, useEffect } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { calculateDashboardStats, getNextPaymentInfo } from '@/utils/calculations';

import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { PaymentTable } from '@/components/PaymentTable';
import { PaymentHistory } from '@/components/PaymentHistory';
import { Sidebar } from '@/components/Sidebar';
import { PaymentModal } from '@/components/PaymentModal';

const App: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const {
        data,
        updateProjectInfo,
        updatePaymentPlan,
        addPayment,
        deletePayment,
        updateOption,
        addOption,
        deleteOption,
        resetData
    } = useAppData();

    // 실시간 날짜 업데이트
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000 * 60 * 60); // 1시간마다 업데이트
        return () => clearInterval(timer);
    }, []);

    // 계산된 값들
    const stats = calculateDashboardStats(data.paymentPlan, data.projectInfo, data.options);
    const nextPaymentInfo = getNextPaymentInfo(data.paymentPlan, currentDate);

    const handleAddPayment = (planId: number, payment: { amount: number; date: string; memo: string }) => {
        addPayment(planId, payment);
    };

    const handleOpenPaymentModal = () => {
        setShowPaymentModal(true);
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 */}
                <Header
                    projectInfo={data.projectInfo}
                    currentDate={currentDate}
                    onUpdateProjectInfo={updateProjectInfo}
                    onResetData={resetData}
                />

                {/* 요약 대시보드 */}
                <Dashboard
                    stats={stats}
                    paymentPlan={data.paymentPlan}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 중도금 계획 및 납부 현황 (메인) */}
                    <div className="lg:col-span-2 space-y-6">
                        <PaymentTable
                            paymentPlan={data.paymentPlan}
                            currentDate={currentDate}
                            onOpenPaymentModal={handleOpenPaymentModal}
                            onUpdatePaymentPlan={updatePaymentPlan}
                        />

                        <PaymentHistory
                            paymentPlan={data.paymentPlan}
                            onDeletePayment={deletePayment}
                        />
                    </div>

                    {/* 사이드바 */}
                    <div>
                        <Sidebar
                            nextPaymentInfo={nextPaymentInfo}
                            stats={stats}
                            paymentPlan={data.paymentPlan}
                            options={data.options}
                            onUpdateOption={updateOption}
                            onAddOption={addOption}
                            onDeleteOption={deleteOption}
                        />
                    </div>
                </div>

                {/* 납부 추가 모달 */}
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={handleClosePaymentModal}
                    paymentPlan={data.paymentPlan}
                    onAddPayment={handleAddPayment}
                />
            </div>
        </div>
    );
};

export default App;