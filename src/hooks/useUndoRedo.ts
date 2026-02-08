import { useState, useCallback } from 'react';
import type { FunnelState } from '../types';

export const useUndoRedo = (initialState: FunnelState) => {
  const [past, setPast] = useState<FunnelState[]>([]);
  const [present, setPresent] = useState<FunnelState>(initialState);
  const [future, setFuture] = useState<FunnelState[]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const setState = useCallback((newState: FunnelState) => {
    setPast((prev) => [...prev, present]);
    setPresent(newState);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    if (!canUndo) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setPast(newPast);
    setPresent(previous);
    setFuture([present, ...future]);
  }, [past, present, future, canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [past, present, future, canRedo]);

  const reset = useCallback((newState: FunnelState) => {
    setPast([]);
    setPresent(newState);
    setFuture([]);
  }, []);

  return {
    state: present,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  };
};
