export default (event, offset = 0) => {
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left - offset;
  const y = event.clientY - rect.top - offset;
  const relativeX = ((x * 100) / rect.width).toFixed(2);
  const relativeY = ((y * 100) / rect.height).toFixed(2);
  return [relativeX, relativeY]
}
