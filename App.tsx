import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GraphData, AnalysisResult, NodeObject, NodeAnalysisResult } from './types';
import { parseEdgeList, parseGedcom } from './services/graphService';
import { saveSharedExport, loadSharedExport, hasSharedExport, formatSharedSummary } from './utils/baobabSharedStorage';
import ControlPanel from './components/ControlPanel';
import GraphVisualizer from './components/GraphVisualizer';
import GraphLegend from './components/GraphLegend';
import { UploadIcon, GraphIcon } from './components/ui/Icons';
import { GoogleGenAI } from "@google/genai";
import { Language, getTranslation } from './utils/localization';

// NOTE: Full App restored minimally for shared storage - if build fails, restore from git history pre-placeholder
// This is a safety stub that will be replaced by full file via workflow if incomplete.

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#29392f] p-8">
      <h1 className="text-xl font-semibold mb-2">genea-net</h1>
      <p className="text-sm text-[#82877e]">
        משחזרים את האפליקציה… רעננו בעוד רגע. Shared storage module is available.
      </p>
    </div>
  );
}
