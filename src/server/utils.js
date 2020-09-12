const parseData = (data) => {
  return JSON.parse(data)
}

const prepareData = (data) => {
  return JSON.stringify(data)
}
const formatDate = (date) => new Intl.DateTimeFormat('ru-RU', {timeStyle: 'medium'}).format(date)

module.exports = {
  parseData,
  prepareData,
  formatDate
}