import { useState, useEffect } from 'react';
import { AppData, PaymentPlan, PaymentHistory, Option, ProjectInfo } from '@/types';
import initialData from '@/data/initial-data.json';

const STORAGE_KEY = 'heristone_app_data';

export const useAppData = () => {
    const [data, setData] = useState<AppData>(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : initialData;
    });

    // 데이터가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const updateProjectInfo = (field: keyof ProjectInfo, value: string | number) => {
        setData(prev => ({
            ...prev,
            projectInfo: {
                ...prev.projectInfo,
                [field]: value
            }
        }));
    };

    const updatePaymentPlan = (id: number, field: keyof PaymentPlan, value: any) => {
        setData(prev => ({
            ...prev,
            paymentPlan: prev.paymentPlan.map(plan =>
                plan.id === id ? { ...plan, [field]: value } : plan
            )
        }));
    };

    const addPayment = (planId: number, payment: Omit<PaymentHistory, 'id'>) => {
        const paymentId = Date.now();

        setData(prev => ({
            ...prev,
            paymentPlan: prev.paymentPlan.map(plan => {
                if (plan.id === planId) {
                    const newPaymentHistory = [...plan.paymentHistory, {
                        id: paymentId,
                        ...payment
                    }];

                    const newPaidAmount = newPaymentHistory.reduce((sum, p) => sum + p.amount, 0);

                    return {
                        ...plan,
                        paymentHistory: newPaymentHistory,
                        paidAmount: newPaidAmount
                    };
                }
                return plan;
            })
        }));
    };

    const deletePayment = (planId: number, paymentId: number) => {
        setData(prev => ({
            ...prev,
            paymentPlan: prev.paymentPlan.map(plan => {
                if (plan.id === planId) {
                    const newPaymentHistory = plan.paymentHistory.filter(p => p.id !== paymentId);
                    const newPaidAmount = newPaymentHistory.reduce((sum, p) => sum + p.amount, 0);

                    return {
                        ...plan,
                        paymentHistory: newPaymentHistory,
                        paidAmount: newPaidAmount
                    };
                }
                return plan;
            })
        }));
    };

    const updateOption = (id: number, field: keyof Option, value: string | number) => {
        setData(prev => ({
            ...prev,
            options: prev.options.map(option =>
                option.id === id ? { ...option, [field]: value } : option
            )
        }));
    };

    const addOption = () => {
        const newId = Math.max(...data.options.map(o => o.id)) + 1;
        setData(prev => ({
            ...prev,
            options: [...prev.options, { id: newId, name: '새 옵션', price: 0 }]
        }));
    };

    const deleteOption = (id: number) => {
        setData(prev => ({
            ...prev,
            options: prev.options.filter(option => option.id !== id)
        }));
    };

    const resetData = () => {
        setData(initialData);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        data,
        updateProjectInfo,
        updatePaymentPlan,
        addPayment,
        deletePayment,
        updateOption,
        addOption,
        deleteOption,
        resetData
    };
};