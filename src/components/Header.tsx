import React from 'react';
import {Clock, Home, RotateCcw} from 'lucide-react';
import {ProjectInfo} from '@/types';
import {formatCurrency, parseCurrency} from '@/utils/currency';
import {formatDate} from '@/utils/date';
import {EditableCell} from './EditableCell';

interface HeaderProps {
    projectInfo: ProjectInfo;
    currentDate: Date;
    onUpdateProjectInfo: (field: keyof ProjectInfo, value: string | number) => void;
    onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
                                                  projectInfo,
                                                  currentDate,
                                                  onUpdateProjectInfo,
                                                  onResetData
                                              }) => {
    const handleUpdateField = (field: keyof ProjectInfo, value: string) => {
        let updatedValue: string | number = value;

        if (field === 'totalAmount') {
            updatedValue = parseCurrency(value);
        } else if (field === 'defaultInterestRate') {
            updatedValue = parseFloat(value.replace('%', '')) || 0;
        }

        onUpdateProjectInfo(field, updatedValue);
    };

    const handleResetData = () => {
        const confirmed = window.confirm(
            '⚠️ 정말로 모든 데이터를 초기화하시겠습니까?\n\n' +
            '• 모든 납부 기록이 삭제됩니다.\n' +
            '• 프로젝트 정보가 기본값으로 돌아갑니다.\n' +
            '• 옵션 정보가 초기화됩니다.\n\n' +
            '이 작업은 되돌릴 수 없습니다.'
        );

        if (confirmed) {
            onResetData();
            alert('✅ 데이터가 성공적으로 초기화되었습니다.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                    <Home className="w-8 h-8 text-blue-600"/>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            <EditableCell
                                value={projectInfo.name}
                                onSave={(value) => handleUpdateField('name', value)}
                                className="inline-block"
                            />
                            분양금 관리
                        </h1>
                        <p className="text-gray-600">중도금을 선택해서 납부하는 똑똑한 시스템 🧠</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4"/>
                        <span>현재 시간</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                        {formatDate(currentDate)}
                    </div>
                    <button
                        onClick={handleResetData}
                        className="mt-2 flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        title="모든 데이터를 초기 상태로 되돌립니다"
                    >
                        <RotateCcw className="w-3 h-3"/>
                        <span>초기화</span>
                    </button>
                </div>
            </div>

            {/* 프로젝트 기본 정보 */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <label className="text-gray-600">총 분양금:</label>
                    <EditableCell
                        value={formatCurrency(projectInfo.totalAmount)}
                        onSave={(value) => handleUpdateField('totalAmount', value)}
                        className="font-semibold"
                    />
                </div>
                <div>
                    <label className="text-gray-600">계약일:</label>
                    <EditableCell
                        value={projectInfo.contractDate}
                        onSave={(value) => handleUpdateField('contractDate', value)}
                        type="date"
                        className="font-semibold"
                    />
                </div>
                <div>
                    <label className="text-gray-600">입주예정일:</label>
                    <EditableCell
                        value={projectInfo.completionDate}
                        onSave={(value) => handleUpdateField('completionDate', value)}
                        type="date"
                        className="font-semibold"
                    />
                </div>
                <div>
                    <label className="text-gray-600">기본 이자율:</label>
                    <EditableCell
                        value={`${projectInfo.defaultInterestRate}%`}
                        onSave={(value) => handleUpdateField('defaultInterestRate', value)}
                        className="font-semibold"
                    />
                </div>
            </div>
        </div>
    );
};