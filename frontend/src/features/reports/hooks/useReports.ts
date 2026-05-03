import { useMemo, useState } from 'react';
import type { GenerateReportForm, ReportDto, ReportRecord } from '../types/report';
import { usePatientQuery } from '../../patients/hooks/usePatientQuery';
import { useReportMutation } from './useReportMutation';
import { useReportQuery } from './useReportQuery';

const PAGE_SIZE = 100;

const mapReportDto = (report: ReportDto): ReportRecord => ({
  report_id: report.reportId,
  patient_id: report.patientId,
  patient_name: report.patientName,
  generated_by: report.generatedByUsername ?? report.generatedBy,
  generated_by_id: report.generatedBy,
  report_type: report.reportType,
  notes: report.notes ?? '',
  summary: report.summary ?? '',
  created_at: report.createdAt,
});

export const useReports = () => {
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    reportType: 'all',
    generatedBy: 'all',
    sortBy: 'newest' as 'newest' | 'oldest',
  });

  const sort = filters.sortBy === 'newest' ? 'createdAt,desc' : 'createdAt,asc';

  const { data: response, isLoading, refetch } = useReportQuery({
    page: 0,
    size: PAGE_SIZE,
    sort,
  });
  const { data: patientsResponse, isLoading: isLoadingPatients } = usePatientQuery({
    page: 0,
    size: 100,
    sort: 'fullName,asc',
  });
  const mutations = useReportMutation();

  const reports = useMemo(
    () => response?.data?.content.map(mapReportDto) ?? [],
    [response],
  );

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        String(report.report_id).toLowerCase().includes(searchTerm) ||
        report.patient_name?.toLowerCase().includes(searchTerm) ||
        report.report_type.toLowerCase().includes(searchTerm) ||
        report.summary.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;

      const createdAt = new Date(report.created_at);
      if (filters.dateFrom && createdAt < new Date(filters.dateFrom)) return false;
      if (filters.dateTo) {
        const end = new Date(filters.dateTo);
        end.setHours(23, 59, 59, 999);
        if (createdAt > end) return false;
      }
      if (filters.reportType !== 'all' && report.report_type !== filters.reportType) return false;
      if (filters.generatedBy !== 'all' && report.generated_by !== filters.generatedBy) return false;

      return true;
    });
  }, [reports, filters]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const now = new Date();
    const typeCounts = new Map<string, number>();

    let todayReports = 0;
    let monthlyReports = 0;

    reports.forEach((report) => {
      const createdAt = new Date(report.created_at);
      if (createdAt.toDateString() === today) todayReports += 1;
      if (
        createdAt.getFullYear() === now.getFullYear() &&
        createdAt.getMonth() === now.getMonth()
      ) {
        monthlyReports += 1;
      }
      typeCounts.set(report.report_type, (typeCounts.get(report.report_type) ?? 0) + 1);
    });

    const mostRequestedType =
      Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None';

    return {
      totalReports: reports.length,
      todayReports,
      monthlyReports,
      mostRequestedType,
    };
  }, [reports]);

  const patientOptions = useMemo(
    () =>
      patientsResponse?.data?.content.map((patient) => ({
        id: String(patient.patientId),
        full_name: patient.fullName,
      })) ?? [],
    [patientsResponse],
  );

  const generatedByOptions = useMemo(
    () =>
      Array.from(new Set(reports.map((report) => report.generated_by))).map((value) => ({
        label: value,
        value,
      })),
    [reports],
  );

  const reportTypeOptions = useMemo(
    () =>
      Array.from(new Set(reports.map((report) => report.report_type))).map((type) => ({
        label: type,
        value: type,
      })),
    [reports],
  );

  const updateFilter = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const generateReport = async (
    values: GenerateReportForm,
    generatedBy: string,
  ): Promise<ReportRecord> => {
    const response = await mutations.generateReport.mutateAsync({
      patientId: values.patient_id,
      generatedBy,
      reportType: values.report_type,
      summary: values.summary,
    });

    return mapReportDto(response.data);
  };

  return {
    reports,
    filteredReports,
    stats,
    filters,
    patientOptions,
    generatedByOptions,
    reportTypeOptions,
    isLoading,
    isLoadingPatients,
    isGenerating: mutations.generateReport.isPending,
    refetch,
    updateFilter,
    generateReport,
  };
};
