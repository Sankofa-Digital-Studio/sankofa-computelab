import { TOPIC1_MODULES, TOPIC1_TITLE } from './topic1-data.js'
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

export const TOPIC1_STORAGE_KEY = 'sankofa-n5-topic1-v1'

export { initialModuleProgress, evaluateQuickCheck }

/**
 * Create a clean empty Topic 1 persistence store.
 */
export function createInitialTopic1Store() {
  return createInitialTopicStore()
}

/**
 * Resolve the storage owner key from an active N5 Gate session, defaulting to 'local-learner'.
 */
export function getTopic1OwnerKey(gateStore) {
  return getTopicOwnerKey(gateStore)
}

/**
 * Read and normalize the Topic 1 store from Web Storage without throwing on missing or corrupt JSON.
 */
export function readTopic1Store(storage = globalThis.localStorage) {
  return readTopicStore(TOPIC1_STORAGE_KEY, storage)
}

/**
 * Persist the Topic 1 store to Web Storage safely.
 */
export function writeTopic1Store(store, storage = globalThis.localStorage) {
  return writeTopicStore(TOPIC1_STORAGE_KEY, store, storage)
}

/**
 * Return normalized Topic 1 progress for a given owner key.
 */
export function getOwnerTopic1Progress(store, ownerKey) {
  return getOwnerTopicProgress(store, ownerKey)
}

/**
 * Determine whether a Topic 1 module is complete: quick check passed, all checklist boxes ticked, and >= 10 chars of evidence notes.
 */
export function isTopic1ModuleComplete(moduleDef, modProgress) {
  return isTopicModuleComplete(moduleDef, modProgress)
}

/**
 * Aggregate overall and Wave 1 completion, quick checks passed, and evidence files across Topic 1 modules.
 */
export function computeTopic1Summary(ownerProgress, modules = TOPIC1_MODULES) {
  return computeTopicSummary(ownerProgress, modules)
}

/**
 * Format a clean plain-text Topic 1 work and evidence summary for learners or lecturers.
 */
export function formatTopic1SummaryText(ownerLabel, ownerProgress, modules = TOPIC1_MODULES) {
  return formatTopicSummaryText({
    title: TOPIC1_TITLE,
    ownerLabel,
    ownerProgress,
    modules,
    consolidationLabel: 'Section 8',
  })
}
