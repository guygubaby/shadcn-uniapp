import type WdButton from '@wot-ui/ui/components/wd-button/wd-button.vue'
import type WdCell from '@wot-ui/ui/components/wd-cell/wd-cell.vue'
import type WdCellGroup from '@wot-ui/ui/components/wd-cell-group/wd-cell-group.vue'
import type WdConfigProvider from '@wot-ui/ui/components/wd-config-provider/wd-config-provider.vue'
import type WdEmpty from '@wot-ui/ui/components/wd-empty/wd-empty.vue'
import type WdForm from '@wot-ui/ui/components/wd-form/wd-form.vue'
import type WdFormItem from '@wot-ui/ui/components/wd-form-item/wd-form-item.vue'
import type WdInput from '@wot-ui/ui/components/wd-input/wd-input.vue'
import type WdPopup from '@wot-ui/ui/components/wd-popup/wd-popup.vue'
import type WdSearch from '@wot-ui/ui/components/wd-search/wd-search.vue'
import type WdSwitch from '@wot-ui/ui/components/wd-switch/wd-switch.vue'
import type WdTag from '@wot-ui/ui/components/wd-tag/wd-tag.vue'

declare module 'vue' {
  export interface GlobalComponents {
    WdButton: typeof WdButton
    WdCell: typeof WdCell
    WdCellGroup: typeof WdCellGroup
    WdConfigProvider: typeof WdConfigProvider
    WdEmpty: typeof WdEmpty
    WdForm: typeof WdForm
    WdFormItem: typeof WdFormItem
    WdInput: typeof WdInput
    WdPopup: typeof WdPopup
    WdSearch: typeof WdSearch
    WdSwitch: typeof WdSwitch
    WdTag: typeof WdTag
  }
}
