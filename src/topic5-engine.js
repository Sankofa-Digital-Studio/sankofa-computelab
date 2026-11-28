import { TOPIC5_MODULES, TOPIC5_TITLE } from './topic5-data.js'
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

export const TOPIC5_STORAGE_KEY = 'sankofa-n5-topic5-v1'

export { initialModuleProgress, evaluateQuickCheck }

/**
 * Create a clean empty Topic 5 persistence store.
 */
export function createInitialTopic5Store() {
  return createInitialTopicStore()
}

/**
 * Resolve the storage owner key from an active N5 Gate session, defaulting to 'local-learner'.
 */
export function getTopic5OwnerKey(gateStore) {
  return getTopicOwnerKey(gateStore)
}

/**
 * Read and normalize the Topic 5 store from Web Storage without throwing on missing or corrupt JSON.
 */
export function readTopic5Store(storage = globalThis.localStorage) {
  return readTopicStore(TOPIC5_STORAGE_KEY, storage)
}

/**
 * Persist the Topic 5 store to Web Storage safely.
 */
export function writeTopic5Store(store, storage = globalThis.localStorage) {
  return writeTopicStore(TOPIC5_STORAGE_KEY, store, storage)
}

/**
 * Return normalized Topic 5 progress for a given owner key.
 */
export function getOwnerTopic5Progress(store, ownerKey) {
  return getOwnerTopicProgress(store, ownerKey)
}

/**
 * Determine whether a Topic 5 module is complete: quick check passed, all checklist boxes ticked, and >= 10 chars of evidence notes.
 */
export function isTopic5ModuleComplete(moduleDef, modProgress) {
  return isTopicModuleComplete(moduleDef, modProgress)
}

/**
 * Aggregate overall and Wave 1 completion, quick checks passed, and evidence files across Topic 5 modules.
 */
export function computeTopic5Summary(ownerProgress, modules = TOPIC5_MODULES) {
  return computeTopicSummary(ownerProgress, modules)
}

/**
 * Format a clean plain-text Topic 5 work and evidence summary for learners or lecturers.
 */
export function formatTopic5SummaryText(ownerLabel, ownerProgress, modules = TOPIC5_MODULES) {
  return formatTopicSummaryText({
    title: TOPIC5_TITLE,
    ownerLabel,
    ownerProgress,
    modules,
    consolidationLabel: 'Section 3A Ethics',
  })
}
