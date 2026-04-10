'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LoginForm } from './components/LoginForm';
import { SelectionsTable } from './components/SelectionsTable';
import { DashboardControls } from './components/DashboardControls';
import { SelectionDetailModal } from './components/SelectionDetailModal';
import { AreaStatistics } from './components/AreaStatistics';

interface Selection {
  id: number;
  matricula: string;
  full_name: string;
  main_area_id: number;
  mainAreaName: string;
  areaPreferenceOrder: number[];
  articlesSelected: { [key: string]: string };
  custom_pdf_path: string | null;
  custom_pdf_name: string | null;
  submitted_at: string;
}

interface AllowedMatriculaEntry {
  matricula?: string;
  matrícula?: string;
  nome?: string;
  externo?: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selections, setSelections] = useState<Selection[]>([]);
  const [loadingSelections, setLoadingSelections] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<number | null>(null);
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [selectedDetail, setSelectedDetail] = useState<Selection | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expectedMatriculasCount, setExpectedMatriculasCount] = useState(0);
  const [externalMatriculas, setExternalMatriculas] = useState<Set<string>>(new Set());

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/admin/api/selections', {
        method: 'GET',
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchSelections();
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const loadExpectedMatriculas = async () => {
      try {
        const response = await fetch('/data/permitidos.json', { method: 'GET' });

        if (!response.ok) {
          throw new Error('Erro ao carregar lista de permitidos');
        }

        const data = (await response.json()) as AllowedMatriculaEntry[];
        const externalSet = new Set<string>();

        const expectedCount = data.reduce((count, entry) => {
          const matricula = String(entry.matricula ?? entry.matrícula ?? '').trim();
          const isExternal =
            entry.externo === true || entry.nome?.toLowerCase().trim() === 'acesso externo';

          if (!matricula) {
            return count;
          }

          if (isExternal) {
            externalSet.add(matricula);
            return count;
          }

          return count + 1;
        }, 0);

        setExpectedMatriculasCount(expectedCount);
        setExternalMatriculas(externalSet);
      } catch {
        setExpectedMatriculasCount(0);
        setExternalMatriculas(new Set());
      }
    };

    loadExpectedMatriculas();
  }, []);

  const fetchSelections = async () => {
    setLoadingSelections(true);
    try {
      const response = await fetch('/admin/api/selections');

      if (!response.ok) {
        throw new Error('Erro ao buscar seleções');
      }

      const data = await response.json();
      setSelections(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar seleções');
    } finally {
      setLoadingSelections(false);
    }
  };

  // Filter selections based on search and filters
  const filteredSelections = useMemo(() => {
    let filtered = selections;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((s) =>
        s.matricula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply area filter
    if (selectedAreaFilter) {
      filtered = filtered.filter((s) => s.main_area_id === selectedAreaFilter);
    }

    // Apply date range filter
    if (dateRangeStart) {
      const startDate = new Date(dateRangeStart).getTime();
      filtered = filtered.filter((s) => new Date(s.submitted_at).getTime() >= startDate);
    }

    if (dateRangeEnd) {
      const endDate = new Date(dateRangeEnd).getTime();
      filtered = filtered.filter((s) => new Date(s.submitted_at).getTime() <= endDate);
    }

    return filtered;
  }, [selections, searchQuery, selectedAreaFilter, dateRangeStart, dateRangeEnd]);

  const completionRate = useMemo(() => {
    if (expectedMatriculasCount <= 0) {
      return '0.0';
    }

    const completedWithoutExternal = selections.filter(
      (selection) => !externalMatriculas.has(selection.matricula)
    ).length;

    const rate = (completedWithoutExternal / expectedMatriculasCount) * 100;
    return Math.min(rate, 100).toFixed(1);
  }, [selections, expectedMatriculasCount, externalMatriculas]);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Credenciais inválidas');
      }

      setIsAuthenticated(true);
      fetchSelections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/admin/api/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setSelections([]);
      setSearchQuery('');
      setSelectedAreaFilter(null);
      setDateRangeStart('');
      setDateRangeEnd('');
    } catch (err) {
      setError('Erro ao fazer logout');
    }
  };

  const handleDownloadPdf = async (selectionId: number) => {
    try {
      const response = await fetch(`/admin/api/download-pdf/${selectionId}`);

      if (!response.ok) {
        throw new Error('Erro ao baixar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seleção_${selectionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao baixar PDF');
    }
  };

  const handleExportCSV = () => {
    if (filteredSelections.length === 0) {
      setError('Nenhuma seleção para exportar');
      return;
    }

    // Prepare CSV content
    const headers = ['Matrícula', 'Nome Completo', 'Área Principal', 'Áreas de Preferência', 'PDFs Enviados', 'Data'];
    const rows = filteredSelections.map((s) => [
      s.matricula,
      s.full_name,
      s.mainAreaName,
      s.areaPreferenceOrder.join(', '),
      s.custom_pdf_path ? 'Sim' : 'Não',
      new Date(s.submitted_at).toLocaleDateString('pt-BR'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `seleções_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (selection: Selection) => {
    setSelectedDetail(selection);
    setShowDetailModal(true);
  };

  const handleDeleteSelection = async (selection: Selection) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja remover a seleção de ${selection.full_name} (${selection.matricula})?`
    );

    if (!confirmDelete) {
      return;
    }

    setError('');

    try {
      const response = await fetch(`/admin/api/selections/${selection.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao remover seleção');
      }

      setSelections((prev) => prev.filter((item) => item.id !== selection.id));

      if (selectedDetail?.id === selection.id) {
        setShowDetailModal(false);
        setSelectedDetail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover seleção');
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />;
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Header */}
      <div className="border-b border-neon-cyan/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-neon-cyan font-mono">Dashboard Admin</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition text-sm"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-300">
              Gerenciamento de seleções da liga Coretech
            </p>
            <Link href="/">
              <button className="text-sm text-neon-cyan hover:text-neon-lightcyan transition">
                ← Voltar ao Menu
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-dark-800 p-6 rounded-lg border border-gray-600">
            <p className="text-gray-400 text-sm uppercase mb-2">Total de Seleções</p>
            <p className="text-4xl font-bold text-neon-cyan">{selections.length}</p>
          </div>

          <div className="bg-dark-800 p-6 rounded-lg border border-gray-600">
            <p className="text-gray-400 text-sm uppercase mb-2">PDFs Enviados</p>
            <p className="text-4xl font-bold text-neon-purple">
              {selections.filter((s) => s.custom_pdf_path).length}
            </p>
          </div>

          <div className="bg-dark-800 p-6 rounded-lg border border-gray-600">
            <p className="text-gray-400 text-sm uppercase mb-2">Taxa de Conclusão</p>
            <p className="text-4xl font-bold text-neon-lime">{completionRate}%</p>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Area Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800 rounded-lg border border-gray-600 p-6 mb-8"
        >
          <AreaStatistics selections={selections} />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800 rounded-lg border border-gray-600 p-6 overflow-hidden"
        >
          <DashboardControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedAreaFilter={selectedAreaFilter}
            onAreaFilterChange={setSelectedAreaFilter}
            dateRangeStart={dateRangeStart}
            onDateRangeStartChange={setDateRangeStart}
            dateRangeEnd={dateRangeEnd}
            onDateRangeEndChange={setDateRangeEnd}
            onExportCSV={handleExportCSV}
            totalCount={filteredSelections.length}
            hasPDFs={selections.some((s) => s.custom_pdf_path)}
          />
          <SelectionsTable
            selections={filteredSelections}
            isLoading={loadingSelections}
            onDownloadPdf={handleDownloadPdf}
            onViewDetails={handleViewDetails}
            onDeleteSelection={handleDeleteSelection}
          />
        </motion.div>
      </div>

      {/* Detail Modal */}
      <SelectionDetailModal
        isOpen={showDetailModal}
        selection={selectedDetail}
        onClose={() => setShowDetailModal(false)}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
}
