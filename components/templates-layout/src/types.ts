import type { VueComponentPropsType } from '@vunk/shared'
import { ElCollapse, ElCollapseItem } from 'element-plus'
import type { BasicSource } from '@vunk/form'


export interface ElCollapseSource<S> extends VueComponentPropsType<typeof ElCollapse>, BasicSource {
  templateType: 'ElCollapse'
  templateSlots: S[]
}

export interface ElCollapseItemSource<S> extends VueComponentPropsType<typeof ElCollapseItem>, BasicSource {
  templateType: 'ElCollapseItem'
  templateSlots?: S[]
}


export type Source<S> = 
  | ElCollapseSource<S>
  | ElCollapseItemSource<S>


export {}
