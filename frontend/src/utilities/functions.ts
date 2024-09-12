export const currencyPhpFormat = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
}).format

function formattedDate(date: string) {
  return new Date(date).toDateString()
}

function splitImages(images: string) {
  return images.split(',')
}

export {
  formattedDate,
  splitImages,
}