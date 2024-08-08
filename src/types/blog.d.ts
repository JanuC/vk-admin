interface newBlogProps {
  title: string
  tags: TagProps[]
  desc: string
  status: 0 | 1
  content: string
}

interface TagProps {
  id: string
  label: string
  bgColor: string
  textColor: string
  blogCount: number
  createTime: Date
  updateTime: Date
}

type QueryBlogFormProps = {
  title: string
  status: 0 | 1 | null
  date: Date[]
  current: number
  pageSize: number
}

type QueryBlogParamsProps = Omit<QueryBlogFormProps, 'date'> & {
  startTime: Date
  endTime: Date
}

type BlogProps = {
  id: string
  title: string
  desc: string
  createBy: UserProps
  status: 0 | 1
  content?: string
  tags: TagProps[]
  viewCount: number
  createTime: Date
  updateTime: Data
}

type BlogResProps = {
  records: BlogProps[]
  total: number
}

type DownloadProps = {
  url: string
}

type BlogPreviewDialogProps = {
  isShow: boolean
  id: string
}

type BlogDateCountProps = {
  date: string
  count: number
}
