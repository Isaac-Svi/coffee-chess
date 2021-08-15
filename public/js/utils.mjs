export const createElement = ({
    id,
    tag = 'div',
    classes,
    text,
    html,
    attributes = {},
}) => {
    const el = document.createElement(tag)

    if (text) el.innerText = text
    if (html) el.innerHTML = html
    if (classes) el.className = classes
    if (id) el.id = id

    for (const a in attributes) {
        el.setAttribute(a, attributes[a])
    }

    return el
}

export const appendMany = (parent, children = []) => {
    for (const c of children) {
        parent.append(c)
    }

    return parent
}

export const _ = (x) => document.getElementById(`sq-${x}`)
