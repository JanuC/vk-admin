import { Md5 } from 'ts-md5'

export const encryptString = (str: string) => {
  const md5 = new Md5()
  return md5.appendAsciiStr(str).end()
}
