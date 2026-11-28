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
import { TOPIC3_MODULES, TOPIC3_TITLE } from './topic3-data.js'

export const TOPIC3_STORAGE_KEY = 'sankofa-n5-topic3-v1'

export {
  createInitialTopicStore as createInitialTopic3Store,
  evaluateQuickCheck,
  initialModuleProgress,
}

export function getTopic3OwnerKey(gateStore) {
  return getTopicOwnerKey(gateStore)
}

export function readTopic3Store(storage = globalThis.localStorage) {
  return readTopicStore(TOPIC3_STORAGE_KEY, storage)
}

export function writeTopic3Store(store, storage = globalThis.localStorage) {
  return writeTopicStore(TOPIC3_STORAGE_KEY, store, storage)
}

export function getOwnerTopic3Progress(store, ownerKey) {
  return getOwnerTopicProgress(store, ownerKey)
}

export function isTopic3ModuleComplete(moduleDef, modProgress) {
  return isTopicModuleComplete(moduleDef, modProgress)
}

export function computeTopic3Summary(ownerProgress) {
  return computeTopicSummary(ownerProgress, TOPIC3_MODULES)
}

export function formatTopic3SummaryText(ownerLabel, ownerProgress) {
  return formatTopicSummaryText({
    title: TOPIC3_TITLE,
    ownerLabel,
    ownerProgress,
    modules: TOPIC3_MODULES,
    consolidationLabel: 'Section 5 & Mastery',
  })
}
