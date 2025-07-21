import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { mockFinancialRecords } from '../../data/mockData';
import { FinancialRecord } from '../../types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
import FinancialRecordForm from './FinancialRecordForm';

const FinancialDashboard: React.FC = () => {
  // Carregar dados reais do localStorage
  const appointments = loadFromStorage(STORAGE_KEYS.APPOINTMENTS, []);
  const storedFinancialRecords = loadFromStorage(STORAGE_KEYS.FINANCIAL_RECORDS, []);
  const [records, setRecords] = useState<FinancialRecord[]>(storedFinancialRecords);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | undefined>();

  // Filtrar registros por tipo e período
  const filteredRecords = records.filter(record => {
    // Filtro por tipo
    const typeMatch = filter === 'all' || record.type === filter;
    
    // Filtro por período
    const recordDate = new Date(record.date);
    const now = new Date();
    let dateMatch = true;
    
    if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateMatch = recordDate >= weekAgo;
    } else if (dateRange === 'month') {
      dateMatch = recordDate.getMonth() === now.getMonth() && 
                  recordDate.getFullYear() === now.getFullYear();
    } else if (dateRange === 'year') {
      dateMatch = recordDate.getFullYear() === now.getFullYear();
    }
    
    return typeMatch && dateMatch;
  });

  const calculateTotals = () => {
    // Filtrar agendamentos por período
    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const now = new Date();
      
      if (dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return appointmentDate >= weekAgo;
      } else if (dateRange === 'month') {
        return appointmentDate.getMonth() === now.getMonth() && 
               appointmentDate.getFullYear() === now.getFullYear();
      } else if (dateRange === 'year') {
        return appointmentDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
    
    // Calcular receita dos agendamentos filtrados
    const appointmentRevenue = filteredAppointments.reduce((sum, appointment) => {
      return sum + (appointment.price || 0);
    }, 0);
    
    // Calcular receita dos registros financeiros filtrados
    const totalIncome = filteredRecords
      .filter(record => record.type === 'income')
      .reduce((sum, record) => sum + record.amount, 0);
    
    // Somar receitas dos agendamentos + registros manuais
    const combinedIncome = appointmentRevenue + totalIncome;
    
    const totalExpenses = filteredRecords
      .filter(record => record.type === 'expense')
      .reduce((sum, record) => sum + record.amount, 0);
    
    const netProfit = combinedIncome - totalExpenses;
    
    return { 
      totalIncome: combinedIncome, 
      totalExpenses, 
      netProfit
    };
  };

  const handleAddRecord = () => {
    setEditingRecord(undefined);
    setShowRecordForm(true);
  };

  const handleEditRecord = (record: FinancialRecord) => {
    setEditingRecord(record);
    setShowRecordForm(true);
  };

  const handleSaveRecord = (record: FinancialRecord) => {
    const updatedRecords = editingRecord 
      ? records.map(r => r.id === record.id ? record : r)
      : [...records, record];
    
    setRecords(updatedRecords);
    saveToStorage(STORAGE_KEYS.FINANCIAL_RECORDS, updatedRecords);
    
    setShowRecordForm(false);
    setEditingRecord(undefined);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      const updatedRecords = records.filter(r => r.id !== id);
      setRecords(updatedRecords);
      saveToStorage(STORAGE_KEYS.FINANCIAL_RECORDS, updatedRecords);
    }
  };



  const getRecordIcon = (type: string) => {
    return type === 'income' ? TrendingUp : TrendingDown;
  };

  const getRecordColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getRecordBgColor = (type: string) => {
    return type === 'income' ? 'bg-green-50' : 'bg-red-50';
  };

  const { totalIncome, totalExpenses, netProfit } = calculateTotals();

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Controle Financeiro</h1>
          <p className="text-sm lg:text-base text-gray-600">Gerencie suas receitas e despesas</p>
        </div>
        <button 
          onClick={handleAddRecord}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg text-sm lg:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Registro</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-xs lg:text-sm font-medium">Receitas</p>
          <p className="text-lg lg:text-2xl font-bold text-green-600">
            {totalIncome > 0 ? `R$ ${totalIncome.toLocaleString('pt-BR')}` : 'R$ 0,00'}
          </p>
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
              <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-xs lg:text-sm font-medium">Despesas</p>
          <p className="text-lg lg:text-2xl font-bold text-red-600">
            {totalExpenses > 0 ? `R$ ${totalExpenses.toLocaleString('pt-BR')}` : 'R$ 0,00'}
          </p>
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className={`p-2 lg:p-3 rounded-lg ${netProfit >= 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
              <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
          <p className="text-gray-600 text-xs lg:text-sm font-medium">Lucro Líquido</p>
          <p className={`text-lg lg:text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {netProfit !== 0 ? `R$ ${netProfit.toLocaleString('pt-BR')}` : 'R$ 0,00'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6 mb-4 lg:mb-6">
        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-4 lg:items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
            <span className="font-medium text-gray-700 text-sm lg:text-base">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
                  filter === type
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'Todos' : type === 'income' ? 'Receitas' : 'Despesas'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setDateRange(period as any)}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
                  dateRange === period
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6 mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Movimentações Recentes</h3>
        {filteredRecords.length > 0 ? (
          <div className="space-y-2 lg:space-y-3">
            {filteredRecords.map((record) => {
              const Icon = getRecordIcon(record.type);
              return (
                <div key={record.id} className={`flex items-center justify-between p-3 lg:p-4 rounded-lg ${getRecordBgColor(record.type)} hover:shadow-md transition-all duration-200`}>
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${getRecordColor(record.type)}`} />
                    <div>
                      <p className="font-medium text-gray-800 text-sm lg:text-base">{record.description}</p>
                      <p className="text-xs lg:text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString('pt-BR')} • {record.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                      <p className={`text-sm lg:text-lg font-bold ${getRecordColor(record.type)}`}>
                      {record.type === 'income' ? '+' : '-'}R$ {record.amount.toLocaleString('pt-BR')}
                      </p>
                      <div className="flex space-x-1 justify-end lg:justify-start">
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm lg:text-base text-gray-500">
              {filter === 'all' ? 'Nenhuma movimentação registrada' : 
               filter === 'income' ? 'Nenhuma receita encontrada' : 'Nenhuma despesa encontrada'}
              {dateRange !== 'year' && ` no período selecionado`}
            </p>
          </div>
        )}
      </div>

      {/* Categories Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Receitas por Categoria</h3>
          {(() => {
            const incomeRecords = filteredRecords.filter(r => r.type === 'income');
            const categories = incomeRecords.reduce((acc, record) => {
              acc[record.category] = (acc[record.category] || 0) + record.amount;
              return acc;
            }, {} as Record<string, number>);
            
            // Adicionar receita de agendamentos
            const appointmentRevenue = appointments
              .filter(appointment => {
                const appointmentDate = new Date(appointment.date);
                const now = new Date();
                
                if (dateRange === 'week') {
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return appointmentDate >= weekAgo;
                } else if (dateRange === 'month') {
                  return appointmentDate.getMonth() === now.getMonth() && 
                         appointmentDate.getFullYear() === now.getFullYear();
                } else if (dateRange === 'year') {
                  return appointmentDate.getFullYear() === now.getFullYear();
                }
                return true;
              })
              .reduce((sum, appointment) => sum + (appointment.price || 0), 0);
            
            if (appointmentRevenue > 0) {
              categories['Consultas'] = (categories['Consultas'] || 0) + appointmentRevenue;
            }
            
            const categoryEntries = Object.entries(categories);
            
            return categoryEntries.length > 0 ? (
              <div className="space-y-2 lg:space-y-3">
                {categoryEntries.map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-800 text-sm lg:text-base">{category}</span>
                    <span className="font-bold text-green-600 text-sm lg:text-base">
                      R$ {amount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma receita no período</p>
              </div>
            );
          })()}
        </div>

        <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Despesas por Categoria</h3>
          {(() => {
            const expenseRecords = filteredRecords.filter(r => r.type === 'expense');
            const categories = expenseRecords.reduce((acc, record) => {
              acc[record.category] = (acc[record.category] || 0) + record.amount;
              return acc;
            }, {} as Record<string, number>);
            
            const categoryEntries = Object.entries(categories);
            
            return categoryEntries.length > 0 ? (
              <div className="space-y-2 lg:space-y-3">
                {categoryEntries.map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-gray-800 text-sm lg:text-base">{category}</span>
                    <span className="font-bold text-red-600 text-sm lg:text-base">
                      R$ {amount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingDown className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma despesa no período</p>
              </div>
            );
          })()}
        </div>
      </div>

      {showRecordForm && (
        <FinancialRecordForm
          record={editingRecord}
          onSave={handleSaveRecord}
          onCancel={() => {
            setShowRecordForm(false);
            setEditingRecord(undefined);
          }}
        />
      )}
    </div>
  );
};

export default FinancialDashboard;