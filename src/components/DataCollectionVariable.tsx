import React, { useState, useEffect } from 'react';
import { Database, Settings, Trash2, Check, X } from 'lucide-react';

interface DynamicVariable {
  type: string;
  description?: string;
  dynamic_variable?: string;
  constant_value?: string;
  constant_value_type?: string;
}

interface Props {
  varName: string;
  varConfig: DynamicVariable;
  editingVarName: string | null;
  editingVarValue: string;
  onEdit: (name: string, value: string) => void;
  onSave: (oldName: string, newName: string) => void;
  onCancel: () => void;
  onDelete: (name: string) => void;
  onChange: (name: string, config: DynamicVariable) => void;
}

export const DataCollectionVariable: React.FC<Props> = ({
  varName,
  varConfig,
  editingVarName,
  editingVarValue,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onChange,
}) => {
  const [variableType, setVariableType] = useState<'description' | 'constant' | 'dynamic'>('description');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (varConfig.constant_value && varConfig.constant_value !== '') {
      setVariableType('constant');
    } else if (varConfig.dynamic_variable && varConfig.dynamic_variable !== '') {
      setVariableType('dynamic');
    } else if (varConfig.description && varConfig.description !== '') {
      setVariableType('description');
    } else if (varConfig.constant_value !== undefined) {
      setVariableType('constant');
    } else if (varConfig.dynamic_variable !== undefined) {
      setVariableType('dynamic');
    } else {
      setVariableType('description');
    }
  }, [varConfig]);

  const handleVariableTypeChange = (newType: 'description' | 'constant' | 'dynamic') => {
    setVariableType(newType);
    const newConfig = { type: varConfig.type } as DynamicVariable;
    if (newType === 'description') {
      newConfig.description = '';
    } else if (newType === 'constant') {
      newConfig.constant_value = '';
      newConfig.constant_value_type = 'string';
    } else if (newType === 'dynamic') {
      newConfig.dynamic_variable = '';
    }
    onChange(varName, newConfig);
  };

  return (
    <div className="p-4 bg-white dark:bg-dark-200 rounded-lg shadow-sm border border-gray-200 dark:border-dark-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary dark:text-primary-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {varName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {varConfig.type} - {variableType}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-400/10 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(varName)}
            className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-100 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={varConfig.type}
              onChange={(e) => onChange(varName, { ...varConfig, type: e.target.value })}
              className="input text-sm"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="integer">Integer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Variable Type
            </label>
            <select
              value={variableType}
              onChange={(e) => handleVariableTypeChange(e.target.value as 'description' | 'constant' | 'dynamic')}
              className="input text-sm"
            >
              <option value="description">Description</option>
              <option value="constant">Constant Value</option>
              <option value="dynamic">Dynamic Variable</option>
            </select>
          </div>

          {variableType === 'description' && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={varConfig.description || ''}
                onChange={(e) => onChange(varName, { ...varConfig, description: e.target.value })}
                className="input text-sm"
                placeholder="Enter description"
              />
            </div>
          )}

          {variableType === 'constant' && (
            <>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Constant Value Type
                </label>
                <select
                  value={varConfig.constant_value_type || 'string'}
                  onChange={(e) => onChange(varName, { ...varConfig, constant_value_type: e.target.value, constant_value: '' })}
                  className="input text-sm"
                >
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="double">Double</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Constant Value
                </label>
                {varConfig.constant_value_type === 'boolean' ? (
                  <select
                    value={varConfig.constant_value || 'true'}
                    onChange={(e) => onChange(varName, { ...varConfig, constant_value: e.target.value })}
                    className="input text-sm"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    type={varConfig.constant_value_type === 'integer' || varConfig.constant_value_type === 'double' ? 'number' : 'text'}
                    step={varConfig.constant_value_type === 'double' ? '0.01' : '1'}
                    value={varConfig.constant_value || ''}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (varConfig.constant_value_type === 'integer') {
                        value = parseInt(value) ? String(parseInt(value)) : '';
                      } else if (varConfig.constant_value_type === 'double') {
                        value = parseFloat(value) ? String(parseFloat(value)) : '';
                      }
                      onChange(varName, { ...varConfig, constant_value: value });
                    }}
                    className="input text-sm"
                    placeholder={`Enter ${varConfig.constant_value_type} value`}
                  />
                )}
              </div>
            </>
          )}

          {variableType === 'dynamic' && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dynamic Variable
              </label>
              <input
                type="text"
                value={varConfig.dynamic_variable || ''}
                onChange={(e) => onChange(varName, { ...varConfig, dynamic_variable: e.target.value })}
                className="input text-sm"
                placeholder="Enter dynamic variable"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};