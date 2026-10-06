/** Keep source order, with three images per row and no trailing singleton. */
export function galleryRows<T>(images: T[]): T[][] {
  const rows: T[][] = [];
  for (let offset = 0; offset < images.length;) {
    const count = images.length - offset === 4 ? 2 : 3;
    rows.push(images.slice(offset, offset + count));
    offset += count;
  }
  return rows;
}
