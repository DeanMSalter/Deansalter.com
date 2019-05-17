export function element(parent,eleName,attrs){ // eslint-disable-line
  const e = document.createElement(eleName)
  if (attrs == null) {
    parent.appendChild(e)
    return e
  }
  for (let i=0; i<Object.keys(attrs).length; i++) {
    e.setAttributeNS(null, Object.keys(attrs)[i], attrs[Object.keys(attrs)[i]])
  }
  parent.appendChild(e)
  return e
}
export function resizeText(parent, element, scale) {
  element.style.fontSize = ((parent.offsetWidth+parent.offsetHeight)/2)*scale
  return element
}
