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
