import React, { useState } from 'react';
import { X, DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import { FinancialRecord } from '../../types';

interface FinancialRecordFormProps {
  record?: FinancialRecord;
  onSave: (record: FinancialRecord) => void;
  onCancel: () => void;
}

const FinancialRecordForm: React.FC<FinancialRecordFormProps> = ({ record, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: record?.type || 'income' as 'income' | 'expense',
    description: record?.description || '',
    amount: record?.amount || 0,
    date: record?.date || new Date().toISOString().split('T')[0],
    category: record?.category || ''
  });

  const incomeCategories = [
    'Consultas',
    'Palestras',
    'Cursos',
    'Produtos',
    'Outros'
  ];

  const expenseCategories = [
    'Aluguel',
    'Equipamentos',
    'Marketing',
    'Educação',
    'Transporte',
    'Alimentação',
    'Material de Escritório',
    'Impostos',
    'Outros'
  ];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: FinancialRecord = {
      id: record?.id || Date.now().toString(),
      type: formData.type,
      description: formData.description,
      amount: formData.amount,
      date: formData.date,
      category: formData.category
    };

    onSave(newRecord);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {record ? 'Editar Registro' : 'Novo Registro Financeiro'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  type: e.target.value as 'income' | 'expense',
                  category: '' // Reset category when type changes
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Descreva o registro financeiro..."
              required
            />
          </div>

          {/* Preview */}
          <div className={`p-4 rounded-lg border-2 ${
            formData.type === 'income' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${
                  formData.type === 'income' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {formData.type === 'income' ? 'Receita' : 'Despesa'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.category} • {formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : 'Data não definida'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  formData.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.type === 'income' ? '+' : '-'}R$ {formData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-lg transition-all duration-200 shadow-lg ${
                formData.type === 'income'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              }`}
            >
              {record ? 'Salvar Alterações' : 'Adicionar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialRecordForm;