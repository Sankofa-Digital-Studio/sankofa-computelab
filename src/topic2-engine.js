import { TOPIC2_MODULES, TOPIC2_TITLE } from './topic2-data.js'
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

export const TOPIC2_STORAGE_KEY = 'sankofa-n5-topic2-v1'

export { initialModuleProgress, evaluateQuickCheck }

/**
 * Create a clean empty Topic 2 persistence store.
 */
export function createInitialTopic2Store() {
  return createInitialTopicStore()
}

/**
 * Resolve the storage owner key from an active N5 Gate session, defaulting to 'local-learner'.
 */
export function getTopic2OwnerKey(gateStore) {
  return getTopicOwnerKey(gateStore)
}

/**
 * Read and normalize the Topic 2 store from Web Storage without throwing on missing or corrupt JSON.
 */
export function readTopic2Store(storage = globalThis.localStorage) {
  return readTopicStore(TOPIC2_STORAGE_KEY, storage)
}

/**
 * Persist the Topic 2 store to Web Storage safely.
 */
export function writeTopic2Store(store, storage = globalThis.localStorage) {
  return writeTopicStore(TOPIC2_STORAGE_KEY, store, storage)
}

/**
 * Return normalized Topic 2 progress for a given owner key.
 */
export function getOwnerTopic2Progress(store, ownerKey) {
  return getOwnerTopicProgress(store, ownerKey)
}

/**
 * Determine whether a Topic 2 module is complete: quick check passed, all checklist boxes ticked, and >= 10 chars of evidence notes.
 */
export function isTopic2ModuleComplete(moduleDef, modProgress) {
  return isTopicModuleComplete(moduleDef, modProgress)
}

/**
 * Aggregate overall and Wave 1 completion, quick checks passed, and evidence files across Topic 2 modules.
 */
export function computeTopic2Summary(ownerProgress, modules = TOPIC2_MODULES) {
  return computeTopicSummary(ownerProgress, modules)
}

/**
 * Format a clean plain-text Topic 2 work and evidence summary for learners or lecturers.
 */
export function formatTopic2SummaryText(ownerLabel, ownerProgress, modules = TOPIC2_MODULES) {
  return formatTopicSummaryText({
    title: TOPIC2_TITLE,
    ownerLabel,
    ownerProgress,
    modules,
    consolidationLabel: 'Section 3 & Mastery',
  })
}
