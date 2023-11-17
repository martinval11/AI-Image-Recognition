import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './App.module.css';

type Prediction = {
  className: string;
  probability: number;
};

// components/ImageFileInput.tsx
type Props = {
  onFilesChange(files: File[]): void;
};

function App() {
  const [predictions, setPredictions] = useState([]);
  const [files, setFiles] = useState<File[]>([]);

  const urls = files.map((file) => URL.createObjectURL(file));

  const ImageFileInput = ({ onFilesChange }: Props) => {
    return (
      <label className={styles.customFileUpload}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const fileList = e.target.files;
            if (fileList) {
              const files = [...fileList];
              onFilesChange(files);
            }
          }}
        />
        Upload Image
      </label>
    );
  };

  useEffect(() => {
    const img = document.querySelector('img');

    if (img !== null) {
      // Load the model.
      mobilenet?.load().then((model: any) => {
        // Classify the image.
        model.classify(img).then((predictions: Prediction[]) => {
          setPredictions(predictions);
        });
      });
    }
  }, [files]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>AI Image Recognition</h1>

        <ImageFileInput
          onFilesChange={(selectedFilies) => {
            setPredictions([]);
            setFiles(selectedFilies);
          }}
        />

        {urls.map((url, i) => {
          const filename = files[i].name;

          return (
            <img src={url} height={300} width={240} key={i} alt={filename} />
          );
        })}

        {files.length === 0 ? (
          <p className={styles.emptyFile}>Please select a file to recognize it</p>
        ) : predictions.length === 0 ? (
          <div className={styles.loaderContainer}>
            <span className={styles.loader}></span>
            <p>Recognizing...</p>
          </div>
        ) : (
          <>
            <h2 className={styles.subtitle}>Results</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Probability</th>
                </tr>
              </thead>
              <tbody>
                {predictions?.map((prediction: Prediction) => (
                  <tr key={uuidv4()}>
                    <td>{prediction.className}</td>
                    <td>{prediction.probability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
