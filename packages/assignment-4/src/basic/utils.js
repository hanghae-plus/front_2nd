export function replaceText(text, replaceTargets) {
  let ret = text;

  for (const [name, value] of Object.entries(replaceTargets)) {
    ret = ret.replace(`$${name}`, value);
  }

  return ret;
}

export function getQuantityOfCartRow($cartRow) {
  return parseInt($cartRow.querySelector('span').textContent.split('x ')[1]);
}

export function discountPrice(originalPrice, discountRatio) {
  return originalPrice * (1 - discountRatio);
}
