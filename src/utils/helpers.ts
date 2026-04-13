

export const randomId = () => crypto.randomUUID().replace(/-/g, '')


export const getChalk = async () => {
  const chalk = (await import('chalk')).default
  return chalk
}
