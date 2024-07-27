

// 根据传入的对象已有属性转换必选、其他可选
type RequiredByKeys<T, K extends keyof T> = {
	[ P in K]: T[ P ]
} & Partial<Omit<T, K>>

// 根据传入的对象已有属性转为可选，其他不变
type PartialByKeys<T, K extends keyof T> = {
	[ P in K]?: T[ P ]
} & Omit<T, K>


// 拼接表单选项
type SpliceFormItem<T, K extends string> = {
	forms: {
		[ P in K]: T
	}
}

// 拼接 filters
type SpliceFilters<T, F> = {
	filters: F
} & T

type EFormItem = import('@/common/components/type').EFormItem

type ETableOpts = import('@/common/components/type').ETableType

type ExportDialogType = import('./type').ExportDialogType
type DialogViewType = import('./type').DialogViewType

type RequestPas = import('./type').RequestPas
type ReturnPas = import('./type').ReturnPas

type EchartsReqRes = import('./type').EchartsReqRes

type SectionType = import('./type').SectionType

type ListItem = import('./type').ListItem