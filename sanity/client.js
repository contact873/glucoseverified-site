import { createClient } from '@sanity/client'

let _client = null

export function getClient() {
  if (!_client) {
    _client = createClient({
      projectId: 'lofyvk3d',
      dataset: 'production',
      apiVersion: '2024-01-01',
      useCdn: true,
    })
  }
  return _client
}

export const client = {
  fetch: (...args) => getClient().fetch(...args)
}