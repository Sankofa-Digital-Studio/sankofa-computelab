import { TOPIC4_MODULES, TOPIC4_TITLE } from './topic4-data.js'
import {
  computeTopicSummary,
  createInitialTopicStore,
  evaluateQuickCheck,
  formatTopicSummaryText,
  getOwnerTopicProgress,
  getTopicOwnerKey,
  initialModuleProgress,
  isTopicModuleComplete,
  readTopicStore,
  writeTopicStore,
} from './topic-engine.js'

export const TOPIC4_STORAGE_KEY = 'sankofa-n5-topic4-v1'

export { initialModuleProgress, evaluateQuickCheck }

/**
 * Create a clean empty Topic 4 persistence store.
 */
export function createInitialTopic4Store() {
  return createInitialTopicStore()
}

/**
 * Resolve the storage owner key from an active N5 Gate session, defaulting to 'local-learner'.
 */
export function getTopic4OwnerKey(gateStore) {
  return getTopicOwnerKey(gateStore)
}

/**
 * Read and normalize the Topic 4 store from Web Storage without throwing on missing or corrupt JSON.
 */
export function readTopic4Store(storage = globalThis.localStorage) {
  return readTopicStore(TOPIC4_STORAGE_KEY, storage)
}

/**
 * Persist the Topic 4 store to Web Storage safely.
 */
export function writeTopic4Store(store, storage = globalThis.localStorage) {
  return writeTopicStore(TOPIC4_STORAGE_KEY, store, storage)
}

/**
 * Return normalized Topic 4 progress for a given owner key.
 */
export function getOwnerTopic4Progress(store, ownerKey) {
  return getOwnerTopicProgress(store, ownerKey)
}

/**
 * Determine whether a Topic 4 module is complete: quick check passed, all checklist boxes ticked, and >= 10 chars of evidence notes.
 */
export function isTopic4ModuleComplete(moduleDef, modProgress) {
  return isTopicModuleComplete(moduleDef, modProgress)
}

/**
 * Aggregate overall and Wave 1 completion, quick checks passed, and evidence files across Topic 4 modules.
 */
export function computeTopic4Summary(ownerProgress, modules = TOPIC4_MODULES) {
  return computeTopicSummary(ownerProgress, modules)
}

/**
 * Format a clean plain-text Topic 4 work and evidence summary for learners or lecturers.
 */
export function formatTopic4SummaryText(ownerLabel, ownerProgress, modules = TOPIC4_MODULES) {
  return formatTopicSummaryText({
    title: TOPIC4_TITLE,
    ownerLabel,
    ownerProgress,
    modules,
    consolidationLabel: 'Section 4 & Mastery',
  })
}
