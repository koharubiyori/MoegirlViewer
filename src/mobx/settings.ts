import { observable, action } from 'mobx'
import { ThemeColorType } from '~/theme'
import storage from '~/utils/storage'
import baseStorage from '~/utils/baseStorage'

// 因为要给set方法提供类型支持，所以这里把属性单独声明出一个接口
export interface SettingsStoreData {
  heimu: boolean
  stopAudioOnLeave: boolean
  cachePriority: boolean
  source: 'hmoe' | 'moegirl'
  theme: ThemeColorType
  lastTheme: ThemeColorType
  lang: 'zh-hans' | 'zh-hant'
}

class SettingsStore implements SettingsStoreData {
  @observable heimu = true
  @observable stopAudioOnLeave = true
  @observable cachePriority = false
  @observable source: SettingsStoreData['source'] = 'moegirl'
  @observable theme: ThemeColorType = 'green'
  @observable lastTheme: ThemeColorType = 'green'
  @observable lang: SettingsStoreData['lang'] = 'zh-hans'

  @action.bound
  set<T extends keyof SettingsStoreData>(this: SettingsStoreData, key: T, value: SettingsStoreData[T]) {
    this[key] = value
    return baseStorage.set('settings', this)
  }
}

export default SettingsStore