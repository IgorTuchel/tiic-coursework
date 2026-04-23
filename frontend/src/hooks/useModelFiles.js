import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const MODEL_BASE = "/tm-model";

async function fetchAsFile(path, filename) {
  const res = await fetch(path);
  const blob = await res.blob();
  return new File([blob], filename);
}

export function useModelFiles() {
  const [modelFiles, setModelFiles] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchAsFile(`${MODEL_BASE}/model.json`, "model.json"),
      fetchAsFile(`${MODEL_BASE}/weights.bin`, "weights.bin"),
      fetchAsFile(`${MODEL_BASE}/metadata.json`, "metadata.json"),
    ])
      .then(([model, weights, metadata]) =>
        setModelFiles({ model, weights, metadata }),
      )
      .catch((err) => {
        console.error("Failed to load AI model:", err);
        toast.error(
          "Failed to load AI model. AR workflow will be unavailable.",
        );
      });
  }, []);

  return modelFiles;
}
