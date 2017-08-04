export const createLogger = label => ({
  log: (...args) => console.log(`[${label}]:`,...args),
  warn: (...args) => console.warn(`[${label}]:`,...args),
  err: (...args) => console.error(`[${label}]:`,...args)
})
const {log} = createLogger('fp')
export const echo = (label, o) => {
  console.log(label, o)
  return o
}
