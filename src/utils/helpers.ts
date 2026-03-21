


export const getChalk = async () => {
  const chalk = (await import('chalk')).default
  return chalk
}
