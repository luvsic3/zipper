export async function pickFile({multiple = true, accept = '*/*'} = {}) {
	const doc = document
	const body = doc.body || doc.documentElement

	return new Promise<File[]>((resolve) => {
		const input = doc.createElement('input')
		const clearInput = () => {
			body.removeEventListener('mousedown', clearInput, false)

			input.remove()
		}

		multiple && input.setAttribute('multiple', String(multiple))
		input.setAttribute('type', 'file')
		input.setAttribute('accept', accept)
		input.style.cssText = 'position:absolute;top:-199px;height:0;opacity:0'

		input.addEventListener('change', () => {
			const files = Array.from(input.files ?? [])
			if (!files[0]) {
				return
			}

			resolve(files)
		})

		body.append(input)

		input.click()

		body.addEventListener('mousedown', clearInput, false)
	})
}

export async function compressFile(file: File) {
	const compressedReadableStream: ReadableStream = file
		.stream()
		// @ts-expect-error
		.pipeThrough(new CompressionStream('deflate'))

	compressedReadableStream.pipeTo
	return new Response(compressedReadableStream).blob()
}

export function downloadFile(blob: Blob, filename: string) {
	const a = document.createElement('a')
	document.body.append(a)
	const url = window.URL.createObjectURL(blob)
	a.href = url
	a.download = filename
	a.click()
	setTimeout(() => {
		window.URL.revokeObjectURL(url)
		a.remove()
	}, 0)
}
