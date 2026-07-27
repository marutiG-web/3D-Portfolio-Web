import React, { useState, useMemo } from 'react';
import { SAMPLE_DATASETS } from '../data/portfolioData';
import { DatasetOption } from '../types';
import { BarChart3, LineChart, PieChart, Database, Sparkles, Filter, RefreshCw, Info, Download, ArrowUpRight } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const DataAnalystWorkbench: React.FC = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('ecommerce-sales');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [selectedMetricIndex, setSelectedMetricIndex] = useState<number>(3); // Default revenue/CPU metric column index

  const dataset: DatasetOption = useMemo(() => {
    return SAMPLE_DATASETS.find((d) => d.id === selectedDatasetId) || SAMPLE_DATASETS[0];
  }, [selectedDatasetId]);

  // Statistical calculations engine
  const stats = useMemo(() => {
    const numericCols = dataset.columns.filter((col, idx) => typeof dataset.data[0][col] === 'number');
    const activeColName = dataset.columns[selectedMetricIndex] || numericCols[0];

    const values = dataset.data
      .map((row) => row[activeColName])
      .filter((v): v is number => typeof v === 'number');

    if (values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length / 2)];

    // Standard deviation
    const squareDiffs = values.map((v) => Math.pow(v - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(avgSquareDiff);

    return {
      activeColName,
      mean: mean.toFixed(1),
      median: median.toFixed(1),
      min,
      max,
      stdDev: stdDev.toFixed(1),
      totalRecords: values.length
    };
  }, [dataset, selectedMetricIndex]);

  return (
    <section id="datalab" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="slide-right-on-scroll bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Database className="w-3.5 h-3.5 text-purple-400" /> Interactive Data Analyst Workbench
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Live Analytics & Insights Sandbox
            </h2>
            <p className="text-slate-300 text-base mt-2">
              Select real dataset options below to execute real-time statistical aggregations, chart renderings, and insight evaluations.
            </p>
          </div>

          {/* Dataset Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {SAMPLE_DATASETS.map((ds) => (
              <button
                key={ds.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedDatasetId(ds.id);
                  setSelectedMetricIndex(ds.columns.length - 2);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedDatasetId === ds.id
                    ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ds.name.split(' ')[0]} {ds.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Dataset Description Banner */}
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-purple-300 font-mono">
              ACTIVE DATASET: {dataset.name}
            </h3>
            <p className="text-xs text-slate-300">
              {dataset.description}
            </p>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => {
                soundFx.playClick();
                setChartType('bar');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                chartType === 'bar' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Bar View
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setChartType('line');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                chartType === 'line' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" /> Line View
            </button>
          </div>
        </div>

        {/* Live Statistical Metrics Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">METRIC ANALYZED</span>
              <span className="text-xs font-bold text-cyan-300 block mt-1 truncate">{stats.activeColName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">MEAN (AVG)</span>
              <span className="text-lg font-bold font-mono text-purple-400 block mt-0.5">{stats.mean}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">MEDIAN</span>
              <span className="text-lg font-bold font-mono text-cyan-400 block mt-0.5">{stats.median}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">RANGE [MIN - MAX]</span>
              <span className="text-xs font-bold font-mono text-emerald-400 block mt-1 truncate">{stats.min} - {stats.max}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">STD DEVIATION</span>
              <span className="text-lg font-bold font-mono text-amber-400 block mt-0.5">{stats.stdDev}</span>
            </div>
          </div>
        )}

        {/* Main Interactive Chart Canvas Visualizer */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" /> Interactive SVG Chart Renderer
            </span>

            {/* Metric Column Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Select Metric:</span>
              <select
                value={selectedMetricIndex}
                onChange={(e) => {
                  soundFx.playClick();
                  setSelectedMetricIndex(Number(e.target.value));
                }}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono py-1 px-3 rounded-lg focus:outline-none focus:border-purple-500"
              >
                {dataset.columns.map((col, idx) => (
                  <option key={col} value={idx}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Custom Responsive Chart */}
          <div className="pt-4 pb-2 px-2">
            <div className="h-64 sm:h-72 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-l border-slate-800 px-4">
              {dataset.data.map((row, idx) => {
                const label = String(row[dataset.columns[0]]);
                const rawVal = row[stats?.activeColName || dataset.columns[1]];
                const numericVal = typeof rawVal === 'number' ? rawVal : 0;
                const maxVal = Math.max(...dataset.data.map((r) => Number(r[stats?.activeColName || dataset.columns[1]]) || 1));
                const heightPct = Math.max((numericVal / maxVal) * 100, 8);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-950 text-purple-200 text-[10px] font-mono px-2 py-0.5 rounded border border-purple-500/40 shadow">
                      {numericVal.toLocaleString()}
                    </span>

                    {/* Bar or Point */}
                    {chartType === 'bar' ? (
                      <div
                        className="w-full max-w-[40px] bg-gradient-to-t from-purple-600 via-indigo-500 to-cyan-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-purple-500/10"
                        style={{ height: `${heightPct}%` }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-end items-center relative">
                        <div
                          className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-md animate-pulse absolute"
                          style={{ bottom: `${heightPct}%` }}
                        />
                      </div>
                    )}

                    {/* X-axis Label */}
                    <span className="text-[10px] font-mono text-slate-400 tracking-tight text-center truncate max-w-full">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Data Insights Box */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Automated Analyst Insights & Observations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataset.insights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1"
              >
                <span className="font-mono font-bold text-purple-400 block">0{idx + 1}. KEY FINDING</span>
                <p>{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
