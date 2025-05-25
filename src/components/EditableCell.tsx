import React, { useState } from 'react';

interface EditableCellProps {
    value: string | number;
    onSave: (value: string) => void;
    type?: 'text' | 'date' | 'number';
    className?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
                                                              value,
                                                              onSave,
                                                              type = 'text',
                                                              className = ''
                                                          }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(String(value));

    const handleSave = () => {
        onSave(editValue);
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditValue(String(value));
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <input
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                className={`w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500 ${className}`}
                autoFocus
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors ${className}`}
            title="클릭하여 편집"
        >
            {value}
        </div>
    );
};