'use client'

import { useState, useCallback } from 'react'
import type { FileNode } from '../components/file-structure-visualization'

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export function useFileStructureHistory(initialState: FileNode) {
  const [history, setHistory] = useState<HistoryState<FileNode>>({
    past: [],
    present: initialState,
    future: [],
  })

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  // Update the present state and move the previous present to past
  const updateStructure = useCallback(
    (newStructure: FileNode, recordInHistory = true) => {
      if (!recordInHistory) {
        setHistory(prevHistory => ({
          ...prevHistory,
          present: newStructure,
        }))
        return
      }

      setHistory(prevHistory => {
        // Don't record if the structure hasn't changed
        if (
          JSON.stringify(prevHistory.present) === JSON.stringify(newStructure)
        ) {
          return prevHistory
        }

        return {
          past: [...prevHistory.past, prevHistory.present],
          present: newStructure,
          future: [],
        }
      })
    },
    []
  )

  // Undo the last change
  const undo = useCallback(() => {
    setHistory(prevHistory => {
      if (prevHistory.past.length === 0) return prevHistory

      const previous = prevHistory.past[prevHistory.past.length - 1]
      const newPast = prevHistory.past.slice(0, prevHistory.past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [prevHistory.present, ...prevHistory.future],
      }
    })
  }, [])

  // Redo the last undone change
  const redo = useCallback(() => {
    setHistory(prevHistory => {
      if (prevHistory.future.length === 0) return prevHistory

      const next = prevHistory.future[0]
      const newFuture = prevHistory.future.slice(1)

      return {
        past: [...prevHistory.past, prevHistory.present],
        present: next,
        future: newFuture,
      }
    })
  }, [])

  // Clear all history
  const clearHistory = useCallback(
    (newPresent?: FileNode) => {
      setHistory({
        past: [],
        present: newPresent || history.present,
        future: [],
      })
    },
    [history.present]
  )

  return {
    fileStructure: history.present,
    updateStructure,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  }
}
