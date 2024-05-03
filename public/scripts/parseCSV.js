export function parseCSV(csvText) {
    const results = Papa.parse(csvText, { header: true }).data;
    return results.map(segment => ({
      x_start: parseFloat(segment.x_start),
      y_start: parseFloat(segment.y_start),
      x_end: parseFloat(segment.x_end),
      y_end: parseFloat(segment.y_end),
      x_mid: parseFloat(segment.x_mid),
      y_mid: parseFloat(segment.y_mid)
    }));
  }
 