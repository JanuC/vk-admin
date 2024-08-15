type QueryOperationLogsProps = {
  filterVal: string
  method: string | null
  date?: Date[]
  current: number
  pageSize: number
  startTime?: string
  endTime?: string
  status: 0 | 1 | null
}

type QueryOperationLogsParamsProps = Omit<queryOperationLogsProps, 'date'> & {
  startTime: Date
  endTime: Date
}

type OperationLogsProps = {
  id: string
  action: string
  method: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT'
  url: string
  moduleName: string
  operator: string
  message: string
  errMessage: string
  params: string
  body: string
  beforeOperationData: string
  afterOperationData: string
  status: 0 | 1
  createTime: Date
}

type FilterListProps = {
  total: number
  records: OperationLogsProps[]
}

type DetailDialogProps = {
  isShow: boolean
  id: string
}

type QueryOperationLogListByUserProps = {
  current: number
  pageSize: number
  username: string
}

type QueryMemUsedParamsProps = {
  time: string
}

type ServerPublicBandwidthProps = {
  enterRecords: ServerInfoRecordProps[]
  outerRecords: ServerInfoRecordProps[]
}

type ServerInfoRecordProps = {
  date: string
  count: number
}
