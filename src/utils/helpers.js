const colors = [
  '#0be1b1', // green
  '#e01563', // red
  '#f2a00a', // orange
  '#6f6f6f', // light gray
  '#0abcf2', // light blue
  '#f20ae0', // pink
  '#e4f20a', // yellow
  '#73472c', // brown
]

export const getColorForIndex = index => colors[index % (colors.length - 1)]
