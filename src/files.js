let database
function open() {
  database ||= new Promise((resolve, reject) => {
    const request = indexedDB.open('sankofa-files', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('files')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => { database = null; reject(request.error) }
  })
  return database
}
export function saveFile(id, file) { return saveFiles([{id,blob:file}]) }
export async function saveFiles(records) {
  const db = await open()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite')
    const files=tx.objectStore('files')
    for(const {id,blob} of records)files.put(blob,id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}
export async function readFile(id) {
  const db = await open()
  return new Promise((resolve, reject) => {
    const request = db.transaction('files').objectStore('files').get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
export async function downloadFile(version) {
  let blob
  let cached = false
  if (version.path) {
    const cache = 'caches' in window ? await caches.open('sankofa-papers-v1').catch(()=>null) : null
    let response = await cache?.match(version.path)
    cached = Boolean(response)
    if (!response) {
      response = await fetch(version.path)
      if (!response.ok) throw Error('Reconnect to download this resource.')
      try { if (cache) { await cache.put(version.path, response.clone()); cached = true } } catch { /* Download remains available. */ }
    }
    blob = await response.blob()
  } else blob = await readFile(version.id)
  if (!blob) throw Error('This file is unavailable on this device.')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = version.file
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
  return cached
}
