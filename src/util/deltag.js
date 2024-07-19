import store from '@/store'

export function findTag(value) {
  let tag
  store.getters.tagList.map((item) => {
    if (item.value === value) {
      tag = item
    }
  })
  return { tag: tag}
}