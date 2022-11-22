import classNames from 'classnames';
import { useState } from 'react';
import { UploadIcon } from '../components/icon';
import styles from '../styles/Home.module.css';
import { compressFile, downloadFile, pickFile } from '../utils/file';

interface FileTask {
  name: string;
  progress: number;
  file: File;
  compressedFile?: Blob;
}

export default function Home() {
  const [tasks, setTasks] = useState<FileTask[]>([]);

  async function chooseFile() {
    const files = await pickFile();
    files.forEach(async (file) => {
      const stream = compressFile(file);
      setTasks((prevTasks) => [
        ...prevTasks,
        { name: file.name, progress: 0, file },
      ]);
      const compressedFile = await stream;
      console.info(`${file.name} 压缩成功`);
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.file == file) {
            task.progress = 100;
            task.compressedFile = compressedFile;
          }
          return task;
        });
      });
    });
  }

  function doDownload(task: FileTask) {
    if (!task.compressedFile) throw new Error('compressedFile not found');
    downloadFile(task.compressedFile, task.name);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={classNames(styles.title, styles.textCenter)}>
          Zipper, file compression in your browser
        </h1>

        <p className={classNames(styles.description, styles.textCenter)}>
          Support any file format, text, images, videos, audios.
        </p>

        <p className={classNames(styles.description, styles.textCenter)}>
          Secure, file never leave your device since zipper work locally.
        </p>

        <div className={styles.drop}>
          <UploadIcon className={styles.dropIcon} />
          <p className={styles.dropText}>Drag & drop your files here</p>
          <p className={styles.dropText}>OR</p>
          <button className={styles.button} onClick={chooseFile}>
            Browse files
          </button>
        </div>

        {!!tasks.length && (
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
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
              {task.compressedFile ? (
                <span onClick={() => doDownload(task)}>下载</span>
              ) : (
                <span>{task.progress}%</span>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
