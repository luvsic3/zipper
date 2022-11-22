export function pickFile({ multiple = true, accept = '*/*' } = {}) {
  const doc = document;
  const body = doc.body || doc.documentElement;

  return new Promise<File[]>((resolve) => {
    const input = doc.createElement('input');
    const clearInput = () => {
      body.removeEventListener('mousedown', clearInput, false);

      body.removeChild(input);

      input.onchange = null;
    };

    multiple && input.setAttribute('multiple', String(multiple));
    input.setAttribute('type', 'file');
    input.setAttribute('accept', accept);
    input.style.cssText = 'position:absolute;top:-199px;height:0;opacity:0';

    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      if (!files[0]) {
        return;
      }

      resolve(files);
    };

    body.appendChild(input);

    input.click();

    body.addEventListener('mousedown', clearInput, false);
  });
}

export async function compressFile(file: File) {
  const compressedReadableStream: ReadableStream = file
    .stream()
    // @ts-ignore
    .pipeThrough(new CompressionStream('deflate'));

  return await new Response(compressedReadableStream).blob();
}

export function downloadFile(blob: Blob, filename: string) {
  const a = document.createElement('a');
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
}
