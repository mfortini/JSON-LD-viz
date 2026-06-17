function isGzipFile(file) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".gz") ||
    name.endsWith(".gzip") ||
    file.type === "application/gzip" ||
    file.type === "application/x-gzip"
  );
}

async function readGzipText(arrayBuffer) {
  const stream = new Blob([arrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"));
  return await new Response(stream).text();
}

export async function readGraphFile(file) {
  if (isGzipFile(file)) {
    const text = await readGzipText(await file.arrayBuffer());
    return { text, compressed: true };
  }

  return { text: await file.text(), compressed: false };
}

export async function parseGraphFile(file) {
  const { text } = await readGraphFile(file);
  return JSON.parse(text);
}
