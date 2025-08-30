import type { ProjectVersion } from '../hooks/use-saved-projects'
import type { FileNode } from '../components/file-structure-visualization'

export interface ThreeWayMergeResult {
  conflicts: ThreeWayConflict[]
  autoResolved: ThreeWayChange[]
  commonAncestor: ProjectVersion | null
  mergeBase: string | null
}

export interface ThreeWayConflict {
  path: string
  type:
    | 'content'
    | 'type'
    | 'structure'
    | 'both-modified'
    | 'both-added'
    | 'both-deleted'
  ancestorValue?: any
  currentValue?: any
  targetValue?: any
  conflictReason: string
  autoResolvable: boolean
  suggestedResolution?: 'current' | 'target' | 'ancestor' | 'merge'
  confidence: number
}

export interface ThreeWayChange {
  path: string
  changeType: 'added' | 'removed' | 'modified' | 'unchanged'
  source: 'current' | 'target' | 'both'
  ancestorValue?: any
  currentValue?: any
  targetValue?: any
  finalValue: any
}

export class ThreeWayMergeService {
  /**
   * Find the common ancestor between two versions
   */
  static findCommonAncestor(
    currentVersion: ProjectVersion,
    targetVersion: ProjectVersion,
    allVersions: ProjectVersion[]
  ): ProjectVersion | null {
    // Sort versions by timestamp
    const sortedVersions = allVersions.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    const currentTime = new Date(currentVersion.timestamp).getTime()
    const targetTime = new Date(targetVersion.timestamp).getTime()

    // Find the latest version that's older than both current and target
    const earliestTime = Math.min(currentTime, targetTime)

    for (let i = sortedVersions.length - 1; i >= 0; i--) {
      const version = sortedVersions[i]
      const versionTime = new Date(version.timestamp).getTime()

      if (
        versionTime < earliestTime &&
        version.versionId !== currentVersion.versionId &&
        version.versionId !== targetVersion.versionId
      ) {
        return version
      }
    }

    // If no common ancestor found, use the earliest version
    return sortedVersions[0] || null
  }

  /**
   * Perform three-way merge analysis
   */
  static performThreeWayMerge(
    ancestor: ProjectVersion | null,
    current: ProjectVersion,
    target: ProjectVersion
  ): ThreeWayMergeResult {
    const conflicts: ThreeWayConflict[] = []
    const autoResolved: ThreeWayChange[] = []

    if (!ancestor) {
      // Fallback to two-way merge if no ancestor
      return this.performTwoWayMerge(current, target)
    }

    // Analyze basic project properties
    this.analyzeProjectProperties(
      ancestor,
      current,
      target,
      conflicts,
      autoResolved
    )

    // Analyze languages
    this.analyzeLanguages(ancestor, current, target, conflicts, autoResolved)

    // Analyze file structure
    if (
      ancestor.details.fileStructure &&
      (current.details.fileStructure || target.details.fileStructure)
    ) {
      this.analyzeFileStructure(
        ancestor.details.fileStructure,
        current.details.fileStructure,
        target.details.fileStructure,
        conflicts,
        autoResolved
      )
    }

    return {
      conflicts,
      autoResolved,
      commonAncestor: ancestor,
      mergeBase: ancestor.versionId,
    }
  }

  private static performTwoWayMerge(
    current: ProjectVersion,
    target: ProjectVersion
  ): ThreeWayMergeResult {
    const conflicts: ThreeWayConflict[] = []
    const autoResolved: ThreeWayChange[] = []

    // Simple two-way comparison for fallback
    const properties = [
      'name',
      'description',
      'type',
      'framework',
      'teamSize',
      'goals',
    ]

    properties.forEach(prop => {
      const currentVal = (current.details as any)[prop]
      const targetVal = (target.details as any)[prop]

      if (currentVal !== targetVal) {
        conflicts.push({
          path: prop,
          type: 'content',
          currentValue: currentVal,
          targetValue: targetVal,
          conflictReason:
            'Both versions modified this property differently (no common ancestor)',
          autoResolvable: false,
          confidence: 0.3,
        })
      }
    })

    return {
      conflicts,
      autoResolved,
      commonAncestor: null,
      mergeBase: null,
    }
  }

  private static analyzeProjectProperties(
    ancestor: ProjectVersion,
    current: ProjectVersion,
    target: ProjectVersion,
    conflicts: ThreeWayConflict[],
    autoResolved: ThreeWayChange[]
  ) {
    const properties = [
      { key: 'name', type: 'string' },
      { key: 'description', type: 'string' },
      { key: 'type', type: 'string' },
      { key: 'framework', type: 'string' },
      { key: 'teamSize', type: 'string' },
      { key: 'goals', type: 'string' },
    ]

    properties.forEach(({ key, type }) => {
      const ancestorVal = (ancestor.details as any)[key]
      const currentVal = (current.details as any)[key]
      const targetVal = (target.details as any)[key]

      const currentChanged = currentVal !== ancestorVal
      const targetChanged = targetVal !== ancestorVal

      if (!currentChanged && !targetChanged) {
        // No changes - keep ancestor value
        autoResolved.push({
          path: key,
          changeType: 'unchanged',
          source: 'both',
          ancestorValue: ancestorVal,
          currentValue: currentVal,
          targetValue: targetVal,
          finalValue: ancestorVal,
        })
      } else if (currentChanged && !targetChanged) {
        // Only current changed - use current
        autoResolved.push({
          path: key,
          changeType: currentVal ? 'modified' : 'removed',
          source: 'current',
          ancestorValue: ancestorVal,
          currentValue: currentVal,
          targetValue: targetVal,
          finalValue: currentVal,
        })
      } else if (!currentChanged && targetChanged) {
        // Only target changed - use target
        autoResolved.push({
          path: key,
          changeType: targetVal ? 'modified' : 'removed',
          source: 'target',
          ancestorValue: ancestorVal,
          currentValue: currentVal,
          targetValue: targetVal,
          finalValue: targetVal,
        })
      } else {
        // Both changed - check if they changed to the same value
        if (currentVal === targetVal) {
          // Both changed to same value - auto resolve
          autoResolved.push({
            path: key,
            changeType: 'modified',
            source: 'both',
            ancestorValue: ancestorVal,
            currentValue: currentVal,
            targetValue: targetVal,
            finalValue: currentVal,
          })
        } else {
          // Both changed to different values - conflict
          const similarity = this.calculateSimilarity(currentVal, targetVal)
          const confidence = this.calculateConfidence(
            ancestorVal,
            currentVal,
            targetVal
          )

          conflicts.push({
            path: key,
            type: 'both-modified',
            ancestorValue: ancestorVal,
            currentValue: currentVal,
            targetValue: targetVal,
            conflictReason: `Both versions modified ${key} differently`,
            autoResolvable: similarity > 0.8,
            suggestedResolution: this.suggestResolution(
              ancestorVal,
              currentVal,
              targetVal,
              similarity
            ),
            confidence,
          })
        }
      }
    })
  }

  private static analyzeLanguages(
    ancestor: ProjectVersion,
    current: ProjectVersion,
    target: ProjectVersion,
    conflicts: ThreeWayConflict[],
    autoResolved: ThreeWayChange[]
  ) {
    const ancestorLangs = new Set(ancestor.details.languages)
    const currentLangs = new Set(current.details.languages)
    const targetLangs = new Set(target.details.languages)

    // Find all unique languages across all versions
    const allLangs = new Set([
      ...ancestorLangs,
      ...currentLangs,
      ...targetLangs,
    ])

    allLangs.forEach(lang => {
      const inAncestor = ancestorLangs.has(lang)
      const inCurrent = currentLangs.has(lang)
      const inTarget = targetLangs.has(lang)

      const currentChanged = inCurrent !== inAncestor
      const targetChanged = inTarget !== inAncestor

      if (!currentChanged && !targetChanged) {
        // No changes
        if (inAncestor) {
          autoResolved.push({
            path: `languages/${lang}`,
            changeType: 'unchanged',
            source: 'both',
            ancestorValue: lang,
            currentValue: inCurrent ? lang : undefined,
            targetValue: inTarget ? lang : undefined,
            finalValue: lang,
          })
        }
      } else if (currentChanged && !targetChanged) {
        // Only current changed
        autoResolved.push({
          path: `languages/${lang}`,
          changeType: inCurrent ? 'added' : 'removed',
          source: 'current',
          ancestorValue: inAncestor ? lang : undefined,
          currentValue: inCurrent ? lang : undefined,
          targetValue: inTarget ? lang : undefined,
          finalValue: inCurrent ? lang : undefined,
        })
      } else if (!currentChanged && targetChanged) {
        // Only target changed
        autoResolved.push({
          path: `languages/${lang}`,
          changeType: inTarget ? 'added' : 'removed',
          source: 'target',
          ancestorValue: inAncestor ? lang : undefined,
          currentValue: inCurrent ? lang : undefined,
          targetValue: inTarget ? lang : undefined,
          finalValue: inTarget ? lang : undefined,
        })
      } else {
        // Both changed
        if (inCurrent === inTarget) {
          // Both made the same change
          autoResolved.push({
            path: `languages/${lang}`,
            changeType: inCurrent ? 'added' : 'removed',
            source: 'both',
            ancestorValue: inAncestor ? lang : undefined,
            currentValue: inCurrent ? lang : undefined,
            targetValue: inTarget ? lang : undefined,
            finalValue: inCurrent ? lang : undefined,
          })
        } else {
          // Conflicting changes
          conflicts.push({
            path: `languages/${lang}`,
            type: inCurrent && inTarget ? 'both-added' : 'both-modified',
            ancestorValue: inAncestor ? lang : undefined,
            currentValue: inCurrent ? lang : undefined,
            targetValue: inTarget ? lang : undefined,
            conflictReason: `Language ${lang} was ${inCurrent ? 'added' : 'removed'} in current and ${
              inTarget ? 'added' : 'removed'
            } in target`,
            autoResolvable: false,
            confidence: 0.5,
          })
        }
      }
    })
  }

  private static analyzeFileStructure(
    ancestor: FileNode | undefined,
    current: FileNode | undefined,
    target: FileNode | undefined,
    conflicts: ThreeWayConflict[],
    autoResolved: ThreeWayChange[],
    basePath = ''
  ) {
    if (!ancestor) return

    // Compare file/directory existence
    const currentExists = !!current
    const targetExists = !!target

    const path = basePath ? `${basePath}/${ancestor.name}` : ancestor.name

    if (!currentExists && !targetExists) {
      // Both deleted - auto resolve as deleted
      autoResolved.push({
        path: `fileStructure/${path}`,
        changeType: 'removed',
        source: 'both',
        ancestorValue: ancestor,
        finalValue: undefined,
      })
      return
    }

    if (currentExists && !targetExists) {
      // Current kept, target deleted
      if (this.fileNodeEquals(ancestor, current)) {
        // Current unchanged, target deleted - use target (delete)
        autoResolved.push({
          path: `fileStructure/${path}`,
          changeType: 'removed',
          source: 'target',
          ancestorValue: ancestor,
          currentValue: current,
          finalValue: undefined,
        })
      } else {
        // Current modified, target deleted - conflict
        conflicts.push({
          path: `fileStructure/${path}`,
          type: 'both-modified',
          ancestorValue: ancestor,
          currentValue: current,
          targetValue: undefined,
          conflictReason: 'File was modified in current but deleted in target',
          autoResolvable: false,
          confidence: 0.3,
        })
      }
      return
    }

    if (!currentExists && targetExists) {
      // Current deleted, target kept
      if (this.fileNodeEquals(ancestor, target)) {
        // Target unchanged, current deleted - use current (delete)
        autoResolved.push({
          path: `fileStructure/${path}`,
          changeType: 'removed',
          source: 'current',
          ancestorValue: ancestor,
          targetValue: target,
          finalValue: undefined,
        })
      } else {
        // Target modified, current deleted - conflict
        conflicts.push({
          path: `fileStructure/${path}`,
          type: 'both-modified',
          ancestorValue: ancestor,
          currentValue: undefined,
          targetValue: target,
          conflictReason: 'File was deleted in current but modified in target',
          autoResolvable: false,
          confidence: 0.3,
        })
      }
      return
    }

    // Both exist - compare content/structure
    if (ancestor.type !== current!.type || ancestor.type !== target!.type) {
      // Type changed
      conflicts.push({
        path: `fileStructure/${path}`,
        type: 'type',
        ancestorValue: ancestor,
        currentValue: current,
        targetValue: target,
        conflictReason: 'File type changed differently in current and target',
        autoResolvable: false,
        confidence: 0.2,
      })
      return
    }

    if (ancestor.type === 'file') {
      // Compare file content
      const ancestorContent = ancestor.content || ''
      const currentContent = current!.content || ''
      const targetContent = target!.content || ''

      const currentChanged = currentContent !== ancestorContent
      const targetChanged = targetContent !== ancestorContent

      if (!currentChanged && !targetChanged) {
        // No changes
        autoResolved.push({
          path: `fileStructure/${path}`,
          changeType: 'unchanged',
          source: 'both',
          ancestorValue: ancestor,
          currentValue: current,
          targetValue: target,
          finalValue: ancestor,
        })
      } else if (currentChanged && !targetChanged) {
        // Only current changed
        autoResolved.push({
          path: `fileStructure/${path}`,
          changeType: 'modified',
          source: 'current',
          ancestorValue: ancestor,
          currentValue: current,
          targetValue: target,
          finalValue: current,
        })
      } else if (!currentChanged && targetChanged) {
        // Only target changed
        autoResolved.push({
          path: `fileStructure/${path}`,
          changeType: 'modified',
          source: 'target',
          ancestorValue: ancestor,
          currentValue: current,
          targetValue: target,
          finalValue: target,
        })
      } else {
        // Both changed
        if (currentContent === targetContent) {
          // Both changed to same content
          autoResolved.push({
            path: `fileStructure/${path}`,
            changeType: 'modified',
            source: 'both',
            ancestorValue: ancestor,
            currentValue: current,
            targetValue: target,
            finalValue: current,
          })
        } else {
          // Different changes - try to merge or conflict
          const mergedContent = this.attemptTextMerge(
            ancestorContent,
            currentContent,
            targetContent
          )
          if (mergedContent.success) {
            autoResolved.push({
              path: `fileStructure/${path}`,
              changeType: 'modified',
              source: 'both',
              ancestorValue: ancestor,
              currentValue: current,
              targetValue: target,
              finalValue: { ...current!, content: mergedContent.result },
            })
          } else {
            conflicts.push({
              path: `fileStructure/${path}`,
              type: 'content',
              ancestorValue: ancestor,
              currentValue: current,
              targetValue: target,
              conflictReason:
                'File content was modified differently in both versions',
              autoResolvable: false,
              confidence: 0.4,
            })
          }
        }
      }
    } else if (ancestor.type === 'directory') {
      // Recursively analyze directory children
      const ancestorChildren = ancestor.children || []
      const currentChildren = current!.children || []
      const targetChildren = target!.children || []

      // Create maps for easier lookup
      const ancestorChildMap = new Map(
        ancestorChildren.map(child => [child.name, child])
      )
      const currentChildMap = new Map(
        currentChildren.map(child => [child.name, child])
      )
      const targetChildMap = new Map(
        targetChildren.map(child => [child.name, child])
      )

      // Get all unique child names
      const allChildNames = new Set([
        ...ancestorChildren.map(c => c.name),
        ...currentChildren.map(c => c.name),
        ...targetChildren.map(c => c.name),
      ])

      allChildNames.forEach(childName => {
        const ancestorChild = ancestorChildMap.get(childName)
        const currentChild = currentChildMap.get(childName)
        const targetChild = targetChildMap.get(childName)

        if (ancestorChild) {
          // Child existed in ancestor
          this.analyzeFileStructure(
            ancestorChild,
            currentChild,
            targetChild,
            conflicts,
            autoResolved,
            path
          )
        } else {
          // Child was added in current or target
          if (currentChild && targetChild) {
            // Added in both - check if they're the same
            if (this.fileNodeEquals(currentChild, targetChild)) {
              autoResolved.push({
                path: `fileStructure/${path}/${childName}`,
                changeType: 'added',
                source: 'both',
                currentValue: currentChild,
                targetValue: targetChild,
                finalValue: currentChild,
              })
            } else {
              conflicts.push({
                path: `fileStructure/${path}/${childName}`,
                type: 'both-added',
                currentValue: currentChild,
                targetValue: targetChild,
                conflictReason: 'File was added differently in both versions',
                autoResolvable: false,
                confidence: 0.3,
              })
            }
          } else if (currentChild) {
            // Added only in current
            autoResolved.push({
              path: `fileStructure/${path}/${childName}`,
              changeType: 'added',
              source: 'current',
              currentValue: currentChild,
              finalValue: currentChild,
            })
          } else if (targetChild) {
            // Added only in target
            autoResolved.push({
              path: `fileStructure/${path}/${childName}`,
              changeType: 'added',
              source: 'target',
              targetValue: targetChild,
              finalValue: targetChild,
            })
          }
        }
      })
    }
  }

  private static fileNodeEquals(a: FileNode, b: FileNode): boolean {
    if (a.type !== b.type || a.name !== b.name) return false

    if (a.type === 'file') {
      return (a.content || '') === (b.content || '')
    }

    if (a.type === 'directory') {
      const aChildren = a.children || []
      const bChildren = b.children || []

      if (aChildren.length !== bChildren.length) return false

      const aChildMap = new Map(aChildren.map(child => [child.name, child]))
      return bChildren.every(bChild => {
        const aChild = aChildMap.get(bChild.name)
        return aChild && this.fileNodeEquals(aChild, bChild)
      })
    }

    return true
  }

  private static attemptTextMerge(
    ancestor: string,
    current: string,
    target: string
  ): { success: boolean; result: string } {
    // Simple line-based merge
    const ancestorLines = ancestor.split('\n')
    const currentLines = current.split('\n')
    const targetLines = target.split('\n')

    // If one version is just an extension of the ancestor, and the other has different changes
    if (current.includes(ancestor) && !target.includes(ancestor)) {
      return { success: false, result: '' }
    }
    if (target.includes(ancestor) && !current.includes(ancestor)) {
      return { success: false, result: '' }
    }

    // If both are extensions of ancestor in non-conflicting ways
    if (current.includes(ancestor) && target.includes(ancestor)) {
      // Try to combine the extensions
      const currentAddition = current.replace(ancestor, '')
      const targetAddition = target.replace(ancestor, '')

      if (
        currentAddition &&
        targetAddition &&
        !currentAddition.includes(targetAddition)
      ) {
        return {
          success: true,
          result: ancestor + currentAddition + targetAddition,
        }
      }
    }

    return { success: false, result: '' }
  }

  private static calculateSimilarity(a: any, b: any): number {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return a === b ? 1 : 0
    }

    const longer = a.length > b.length ? a : b
    const shorter = a.length > b.length ? b : a

    if (longer.length === 0) return 1

    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  private static calculateConfidence(
    ancestor: any,
    current: any,
    target: any
  ): number {
    // Calculate confidence based on how different the changes are
    const ancestorStr = String(ancestor || '')
    const currentStr = String(current || '')
    const targetStr = String(target || '')

    const currentSim = this.calculateSimilarity(ancestorStr, currentStr)
    const targetSim = this.calculateSimilarity(ancestorStr, targetStr)
    const bothSim = this.calculateSimilarity(currentStr, targetStr)

    // Higher confidence if changes are similar to each other
    return (currentSim + targetSim + bothSim) / 3
  }

  private static suggestResolution(
    ancestor: any,
    current: any,
    target: any,
    similarity: number
  ): 'current' | 'target' | 'ancestor' | 'merge' | undefined {
    if (similarity > 0.8) return 'merge'

    const ancestorStr = String(ancestor || '')
    const currentStr = String(current || '')
    const targetStr = String(target || '')

    // If one is closer to ancestor, suggest the other (the one with more changes)
    const currentSim = this.calculateSimilarity(ancestorStr, currentStr)
    const targetSim = this.calculateSimilarity(ancestorStr, targetStr)

    if (Math.abs(currentSim - targetSim) > 0.3) {
      return currentSim < targetSim ? 'current' : 'target'
    }

    return undefined
  }
}
