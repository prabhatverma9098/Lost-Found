import React from 'react';
import { ItemStatus, StatusHistoryEntry } from '../../types';
import { ORDERED_STATUS_FLOW, getStatusStepIndex } from '../../services/statusTracking';
import { Check, Clock, AlertCircle, XCircle, RotateCcw } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: ItemStatus;
  history?: StatusHistoryEntry[];
  compact?: boolean;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  history = [],
  compact = false,
}) => {
  const isTerminalNegative = currentStatus === 'Rejected' || currentStatus === 'Cancelled';
  const currentIndex = getStatusStepIndex(currentStatus);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {ORDERED_STATUS_FLOW.map((step, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;

          return (
            <React.Fragment key={step}>
              <div
                className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors shrink-0 ${
                  isCurrent
                    ? 'bg-[#0866E8] text-white'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                <span>{step}</span>
              </div>
              {idx < ORDERED_STATUS_FLOW.length - 1 && (
                <div
                  className={`w-3 h-0.5 shrink-0 ${
                    currentIndex > idx ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0866E8]" />
          <h4 className="text-sm font-bold text-[#0B1F3A]">Item Status Lifecycle</h4>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            currentStatus === 'Returned' || currentStatus === 'Approved'
              ? 'bg-emerald-100 text-emerald-800'
              : currentStatus === 'Rejected' || currentStatus === 'Cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-[#0866E8]'
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {/* Visual Stepper Track */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {ORDERED_STATUS_FLOW.map((step, idx) => {
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;
          const isPending = currentIndex < idx;

          // Check if there is a recorded history entry for this step
          const historyEntry = history.find(h => h.status === step);

          return (
            <div key={step} className="relative flex items-start gap-3 group">
              {/* Step indicator node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                  isCurrent
                    ? 'bg-[#0866E8] text-white ring-4 ring-blue-100 shadow-xs'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-300'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      isCurrent
                        ? 'text-[#0866E8]'
                        : isDone
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </p>
                  {historyEntry?.timestamp && (
                    <span className="text-[11px] font-medium text-slate-400">
                      {historyEntry.timestamp}
                    </span>
                  )}
                </div>

                {historyEntry?.note ? (
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {historyEntry.note}
                    {historyEntry.updatedBy && (
                      <span className="text-slate-400 italic"> — {historyEntry.updatedBy}</span>
                    )}
                  </p>
                ) : isCurrent ? (
                  <p className="text-xs text-[#0866E8] mt-0.5 font-medium">
                    Current stage in progress.
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* If rejected or cancelled, show red terminal branch */}
        {isTerminalNegative && (
          <div className="relative flex items-start gap-3 pt-2">
            <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center ring-4 ring-red-100">
              <XCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-700">{currentStatus}</p>
              <p className="text-xs text-red-600 mt-0.5">
                {history[history.length - 1]?.note || 'This claim or report was closed without resolution.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
