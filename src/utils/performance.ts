import React from "react";

// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Debounce utility for search inputs
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Lazy loading utility
export const lazyLoad = <T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// Interface para performance.memory
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Memory usage monitoring
export const logMemoryUsage = () => {
  if ("memory" in performance) {
    const memory = (performance as Performance & { memory: PerformanceMemory })
      .memory;
    console.log("Memory usage:", {
      used: Math.round(memory.usedJSHeapSize / 1048576) + " MB",
      total: Math.round(memory.totalJSHeapSize / 1048576) + " MB",
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + " MB",
    });
  }
};
