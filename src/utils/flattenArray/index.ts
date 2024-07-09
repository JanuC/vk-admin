// 数组扁平化

interface TreeNode<T> {
  id: T
  parentId?: T
  children?: TreeNode<T>[]
  [key: string]: any
}

// 扁平化数组
export const flattenArray = <T>(arr: TreeNode<T>[]): TreeNode<T>[] => {
  return arr.reduce((acc: TreeNode<T>[], val: TreeNode<T>) => {
    if (Array.isArray(val.children)) {
      return acc.concat(val, flattenArray(val.children))
    } else {
      return acc.concat(val)
    }
  }, [])
}

// 将数组返回成树状结构
export const unflattenArray = <T>(arr: TreeNode<T>[]): TreeNode<T>[] => {
  const map = new Map<T, TreeNode<T>>()

  arr.forEach((node) => {
    map.set(node.id, { ...node, children: [] })
  })

  const roots: TreeNode<T>[] = []

  arr.forEach((node) => {
    if (node.parentId === undefined) {
      roots.push(map.get(node.id)!)
    } else {
      const parent = map.get(node.parentId)
      if (parent) {
        parent.children!.push(map.get(node.id)!)
      }
    }
  })

  return roots
}
