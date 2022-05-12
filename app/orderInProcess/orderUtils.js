
function mergeOrderArr(buyingArr, previousArr) {
  let newArr = previousArr.map(prev => {
    // incrementing quantity
    const matched = buyingArr.filter(buying => buying.product._id == prev.product.valueOf())
    if (matched.length) {
      console.log('increment running...')
      const incremented = prev
      incremented.quantity = incremented.quantity + matched[0].quantity
      console.log(incremented)
      return incremented
    }
    return prev
  })
  buyingArr.forEach((buying, i) => {
    // adding new order
    const matched = previousArr.filter(item2 => item2.product.valueOf() == buying.product._id)
    if (!matched.length) {
      newArr.push({
        product: buying.product._id,
        quantity: buying.quantity
      })
    }
  })
  return newArr
}

module.exports = {mergeOrderArr};
