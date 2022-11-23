import classNames from 'classnames'
import {type DragEvent, useState} from 'react'
import {UploadIcon} from '../components/icon'
import styles from '../styles/Home.module.css'
import utilStyles from '../styles/util.module.css'
import {compressFile, downloadFile, pickFile} from '../utils/file'

type FileTask = {
	name: string
	progress: number
	file: File
	compressedFile?: Blob
}

export default function Home() {
	const [tasks, setTasks] = useState<FileTask[]>([])

	async function chooseFile() {
		const files = await pickFile()
		addTasks(files)
	}

	function addTasks(files: File[]) {
		files.forEach(async (file) => {
			const stream = compressFile(file)
			setTasks((previousTasks) => [
				{name: file.name, progress: 0, file},
				...previousTasks,
			])
			const compressedFile = await stream
			console.info(`${file.name} 压缩成功`)
			setTasks((previousTasks) => {
				return previousTasks.map((task) => {
					if (task.file === file) {
						task.progress = 100
						task.compressedFile = compressedFile
					}

					return task
				})
			})
		})
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		stopEvent(event)
		const files = Array.from(event.dataTransfer.files)
		addTasks(files)
	}

	function stopEvent(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		event.stopPropagation()
	}

	return (
		<div className={styles.container}>
			<main className={styles.main}>
				<div>
					<img className={styles.logo} src="/logo.png" alt="" />
					<a
						className={styles.sourceCode}
						href="https://github.com/luvsic3/zipper"
						target="_blank"
					>
						Source code
					</a>
				</div>
				<h2 className={classNames(styles.title, utilStyles.textCenter)}>
					Zipper, compress file in browser
				</h2>

				<p className={classNames(styles.description, utilStyles.textCenter)}>
					Support any file format, text, images, videos, audios.
				</p>

				<p className={classNames(styles.description, utilStyles.textCenter)}>
					Secure, file never leave your device since zipper work locally.
				</p>

				<div
					className={styles.drop}
					onDrop={handleDrop}
					onDragOver={stopEvent}
					onDragLeave={stopEvent}
				>
					<UploadIcon className={styles.dropIcon} />
					<p className={styles.dropText}>Drag & drop your files here</p>
					<p className={styles.dropText}>OR</p>
					<button className={utilStyles.button} onClick={chooseFile}>
						Browse files
					</button>
				</div>

				{tasks.length > 0 && (
					<div className={styles.listHeader}>Uploading files</div>
				)}

				{tasks.map((task, index) => {
					return (
						<div className={styles.row} key={index}>
							<div className={styles.rowLeft}>
								<p className={styles.rowTitle}>{task.name}</p>
								<div className={styles.slider}>
									<div
										className={styles.progress}
										style={{width: `${task.progress}%`}}
									></div>
								</div>
							</div>
							{task.compressedFile ? (
								<button
									className={classNames(styles.rowRight, utilStyles.button)}
									onClick={() => {
										doDownload(task)
									}}
								>
									Download
								</button>
							) : (
								<span className={styles.rowRight}>compressing</span>
							)}
						</div>
					)
				})}
			</main>
		</div>
	)
}

function doDownload(task: FileTask) {
	if (!task.compressedFile) throw new Error('compressedFile not found')
	downloadFile(task.compressedFile, task.name)
}
