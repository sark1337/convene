"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { format, parseISO, setHours, setMinutes, eachDayOfInterval } from "date-fns";

interface AvailabilityGridProps {
  dateRange: { start: Date; end: Date };
  timeRange: { start: string; end: string };
  availability: Set<string>; // ISO strings of selected slots
  participants?: { name: string; availability: Set<string> }[];
  onChange?: (availability: Set<string>) => void;
  readonly?: boolean;
  showHeatmap?: boolean;
  timezone?: string;
}

interface Cell {
  date: Date;
  time: string;
  isoString: string;
  row: number;
  col: number;
}

export function AvailabilityGrid({
  dateRange,
  timeRange,
  availability,
  participants = [],
  onChange,
  readonly = false,
  showHeatmap = false,
  timezone,
}: AvailabilityGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");
  const [focusedCell, setFocusedCell] = useState<number>(0);
  const [cells, setCells] = useState<Cell[]>([]);

  // Parse time range
  const startHour = parseInt(timeRange.start.split(":")[0], 10);
  const endHour = parseInt(timeRange.end.split(":")[0], 10);
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  
  // Generate dates
  const dates = useMemo(() => eachDayOfInterval({
    start: dateRange.start,
    end: dateRange.end,
  }), [dateRange.start, dateRange.end]);

  // Generate all cells
  useEffect(() => {
    const allCells: Cell[] = [];
    dates.forEach((date, col) => {
      hours.forEach((hour, row) => {
        const cellDate = setMinutes(setHours(date, hour), 0);
        allCells.push({
          date: cellDate,
          time: `${String(hour).padStart(2, "0")}:00`,
          isoString: cellDate.toISOString(),
          row,
          col,
        });
      });
    });
    setCells(allCells);
  }, [dates, hours]);

  // Get cell availability count for heatmap
  const getCellCount = useCallback(
    (isoString: string): number => {
      if (!showHeatmap || participants.length === 0) return 0;
      return participants.filter((p) => p.availability.has(isoString)).length;
    },
    [participants, showHeatmap]
  );

  // Get heatmap color based on availability
  const getHeatmapColor = useCallback(
    (count: number, max: number): string => {
      if (max === 0) return "bg-gray-100";
      const ratio = count / max;
      
      if (ratio === 0) return "bg-gray-100";
      if (ratio < 0.25) return "bg-emerald-100";
      if (ratio < 0.5) return "bg-emerald-200";
      if (ratio < 0.75) return "bg-emerald-300";
      if (ratio < 1) return "bg-emerald-400";
      return "bg-emerald-500";
    },
    []
  );

  // Get cell background
  const getCellBackground = useCallback(
    (isoString: string): string => {
      const isSelected = availability.has(isoString);
      
      if (showHeatmap) {
        const max = participants.length || 1;
        const count = getCellCount(isoString);
        return getHeatmapColor(count, max);
      }
      
      return isSelected ? "bg-primary" : "bg-gray-100 hover:bg-gray-200";
    },
    [availability, showHeatmap, participants, getCellCount, getHeatmapColor]
  );

  // Handle cell toggle (keyboard and click)
  const handleCellToggle = useCallback(
    (cell: Cell) => {
      if (readonly) return;
      
      const newAvailability = new Set(availability);
      if (newAvailability.has(cell.isoString)) {
        newAvailability.delete(cell.isoString);
      } else {
        newAvailability.add(cell.isoString);
      }
      onChange?.(newAvailability);
    },
    [availability, onChange, readonly]
  );

  // Handle pointer events for drag selection
  const handlePointerDown = useCallback(
    (cell: Cell) => {
      if (readonly) return;
      setIsDragging(true);
      const mode = availability.has(cell.isoString) ? "deselect" : "select";
      setDragMode(mode);
      handleCellToggle(cell);
    },
    [availability, readonly, handleCellToggle]
  );

  const handlePointerEnter = useCallback(
    (cell: Cell) => {
      if (!isDragging || readonly) return;
      
      const newAvailability = new Set(availability);
      if (dragMode === "select") {
        newAvailability.add(cell.isoString);
      } else {
        newAvailability.delete(cell.isoString);
      }
      onChange?.(newAvailability);
    },
    [isDragging, readonly, dragMode, availability, onChange]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, cell: Cell, index: number) => {
      if (readonly) return;
      
      const cols = dates.length;
      let newIndex = index;
      
      switch (event.key) {
        case "ArrowRight":
          newIndex = Math.min(index + 1, cells.length - 1);
          break;
        case "ArrowLeft":
          newIndex = Math.max(index - 1, 0);
          break;
        case "ArrowDown":
          newIndex = Math.min(index + cols, cells.length - 1);
          break;
        case "ArrowUp":
          newIndex = Math.max(index - cols, 0);
          break;
        case " ":
        case "Enter":
          event.preventDefault();
          handleCellToggle(cell);
          return;
        default:
          return;
      }
      
      event.preventDefault();
      setFocusedCell(newIndex);
      
      // Focus the new cell
      const newCell = gridRef.current?.querySelector(`[data-cell-index="${newIndex}"]`) as HTMLElement;
      newCell?.focus();
    },
    [readonly, dates.length, cells.length, handleCellToggle]
  );

  // Add global pointer up listener
  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerUp]);

  const maxParticipants = participants.length || 1;

  return (
    <div 
      className="w-full overflow-x-auto scroll-touch" 
      ref={gridRef}
      role="grid"
      aria-label="Availability time slots"
      aria-describedby="grid-instructions"
    >
      {/* Screen reader instructions */}
      <span id="grid-instructions" className="sr-only">
        Use arrow keys to navigate time slots. Press Space or Enter to toggle availability.
      </span>
      
      <div className="min-w-max">
        {/* Date headers */}
        <div className="flex mb-2" role="row">
          <div className="w-16 flex-shrink-0 sticky left-0 bg-background z-10" role="columnheader" aria-label="Time">
            <span className="sr-only">Time column</span>
          </div>
          {dates.map((date) => (
            <div
              key={date.toISOString()}
              className="flex-1 text-center py-2 font-medium text-gray-700 min-w-[44px]"
              role="columnheader"
              aria-label={format(date, "EEEE, MMMM d")}
            >
              <div className="text-xs text-gray-500">
                {format(date, "EEE")}
              </div>
              <div className="text-sm">{format(date, "MMM d")}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col">
          {hours.map((hour, rowIdx) => (
            <div key={hour} className="flex" role="row">
              {/* Time label - sticky on mobile scroll */}
              <div 
                className="w-16 flex-shrink-0 flex items-center justify-end pr-2 text-sm text-gray-500 sticky left-0 bg-background z-10 shadow-[4px_0_8px_rgba(0,0,0,0.1)]"
                role="rowheader"
                aria-label={`${format(setHours(new Date(), hour), "h a")}`}
              >
                {format(setHours(new Date(), hour), "h a")}
              </div>
              
              {/* Cells */}
              {dates.map((date, colIdx) => {
                const cell = cells.find(
                  (c) => c.row === rowIdx && c.col === colIdx
                );
                if (!cell) return null;

                const isSelected = availability.has(cell.isoString);
                const count = getCellCount(cell.isoString);
                const index = rowIdx * dates.length + colIdx;

                return (
                  <motion.div
                    key={cell.isoString}
                    data-cell-index={index}
                    whileHover={!readonly ? { scale: 1.1 } : {}}
                    whileTap={!readonly ? { scale: 0.95 } : {}}
                    className={`
                      min-w-[44px] min-h-[44px] m-0.5 rounded-lg cursor-pointer
                      transition-colors duration-150 select-none-drag grid-cell
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                      ${getCellBackground(cell.isoString)}
                      ${readonly ? "cursor-default" : ""}
                      ${isSelected && !showHeatmap ? "text-white" : ""}
                    `}
                    role="gridcell"
                    tabIndex={index === focusedCell ? 0 : -1}
                    aria-selected={isSelected}
                    aria-label={`${format(cell.date, "EEE, MMM d 'at' h a")}${isSelected ? ", selected" : ""}`}
                    onPointerDown={() => handlePointerDown(cell)}
                    onPointerEnter={() => handlePointerEnter(cell)}
                    onKeyDown={(e) => handleKeyDown(e, cell, index)}
                    style={{ touchAction: "none" }}
                  >
                    {showHeatmap && count > 0 && (
                      <div className="w-full h-full flex items-center justify-center text-xs font-medium" aria-hidden="true">
                        {count}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Heatmap legend */}
        {showHeatmap && participants.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 flex-wrap" role="region" aria-label="Availability legend">
            <span>Availability:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-gray-100" aria-hidden="true" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-emerald-200" aria-hidden="true" />
              <span>Some</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-emerald-500" aria-hidden="true" />
              <span>All</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}