import { Activity, AlertTriangle, CheckCircle2, FileImage, Loader2, Server, UploadCloud, X } from "lucide-react";
import { ChangeEvent, DragEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ApiError, getApiBaseUrl, getBackendAssetUrl, getHealth, predictImage } from "./services/apiClient";
import type { HealthResponse, PredictionResponse } from "./types/api";

const ACCEPTED_FORMATS = ["image/jpeg", "image/png", "image/bmp", "image/tiff"];
const CASE_TYPES = [
  { value: "unknown", label: "No especificado" },
  { value: "normal", label: "Normal" },
  { value: "scoliosis", label: "Escoliosis" },
] as const;

function isDisplayableImagePath(path: string | null): path is string {
  if (!path) return false;
  return (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/static/") ||
    path.startsWith("/results/")
  );
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [caseType, setCaseType] = useState<(typeof CASE_TYPES)[number]["value"]>("unknown");
  const [error, setError] = useState<string | null>(null);
  const [missingArtifacts, setMissingArtifacts] = useState<string[]>([]);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const modelReady = health?.model_ready ?? false;

  const selectedFileSize = useMemo(() => {
    if (!selectedFile) return "";
    const sizeInMb = selectedFile.size / (1024 * 1024);
    return `${sizeInMb.toFixed(sizeInMb >= 10 ? 1 : 2)} MB`;
  }, [selectedFile]);

  const refreshHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    setHealthError(null);
    try {
      const response = await getHealth();
      setHealth(response);
    } catch (err) {
      setHealth(null);
      setHealthError(err instanceof Error ? err.message : "No fue posible conectar con el microservicio.");
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  useEffect(() => {
    void refreshHealth();
  }, [refreshHealth]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setImageFile = (file: File) => {
    if (!ACCEPTED_FORMATS.includes(file.type) && !/\.(jpe?g|png|bmp|tiff?)$/i.test(file.name)) {
      setError("Formato no soportado. Usa jpg, jpeg, png, bmp, tif o tiff.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setError(null);
    setMissingArtifacts([]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setImageFile(file);
  };

  const clearSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    setMissingArtifacts([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submitPrediction = async () => {
    if (!selectedFile) {
      setError("Selecciona una radiografia antes de ejecutar inferencia.");
      return;
    }

    setIsPredicting(true);
    setError(null);
    setMissingArtifacts([]);
    setPrediction(null);

    try {
      const response = await predictImage(selectedFile, caseType);
      setPrediction(response);
      await refreshHealth();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setMissingArtifacts(err.missingArtifacts);
      } else {
        setError(err instanceof Error ? err.message : "No fue posible ejecutar la inferencia.");
      }
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Scoliosis Segmentation</p>
            <h1>Segmentacion de Vertebras</h1>
          </div>
          <div className={`service-pill ${modelReady ? "is-ready" : "is-warning"}`}>
            {modelReady ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{modelReady ? "Modelos listos" : "Revisar modelos"}</span>
          </div>
        </header>

        <section className="status-strip" aria-label="Estado del microservicio">
          <div className="status-item">
            <Server size={20} />
            <div>
              <span>API</span>
              <strong>{getApiBaseUrl()}</strong>
            </div>
          </div>
          <div className="status-item">
            <Activity size={20} />
            <div>
              <span>Servicio</span>
              <strong>{healthError ? "Sin conexion" : health?.status ?? "Verificando"}</strong>
            </div>
          </div>
          <button className="ghost-button" onClick={refreshHealth} disabled={isCheckingHealth}>
            {isCheckingHealth ? <Loader2 className="spin" size={17} /> : <Server size={17} />}
            Actualizar
          </button>
        </section>

        <section className="main-grid">
          <div className="panel upload-panel">
            <div className="section-heading">
              <span>01</span>
              <div>
                <h2>Cargar radiografia</h2>
                <p>Selecciona una imagen lateral o frontal de columna para enviar al microservicio.</p>
              </div>
            </div>

            <div
              className={`drop-zone ${isDragging ? "is-dragging" : ""} ${previewUrl ? "has-image" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.bmp,.tif,.tiff,image/*"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Vista previa de radiografia cargada" />
              ) : (
                <div className="drop-copy">
                  <UploadCloud size={34} />
                  <strong>Arrastra una radiografia o selecciona un archivo</strong>
                  <span>JPG, PNG, BMP, TIF o TIFF</span>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="file-row">
                <FileImage size={20} />
                <div>
                  <strong>{selectedFile.name}</strong>
                  <span>{selectedFileSize}</span>
                </div>
                <button className="icon-button" onClick={clearSelection} aria-label="Quitar imagen">
                  <X size={18} />
                </button>
              </div>
            )}

            <label className="case-control">
              <span>Tipo de caso</span>
              <select value={caseType} onChange={(event) => setCaseType(event.target.value as typeof caseType)}>
                {CASE_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary-button" onClick={submitPrediction} disabled={isPredicting || !selectedFile}>
              {isPredicting ? <Loader2 className="spin" size={18} /> : <Activity size={18} />}
              {isPredicting ? "Ejecutando inferencia" : "Ejecutar inferencia"}
            </button>
          </div>

          <div className="panel result-panel">
            <div className="section-heading">
              <span>02</span>
              <div>
                <h2>Resultado del modelo</h2>
                <p>Visualiza etiquetas detectadas, rutas de salida y estado de la prediccion.</p>
              </div>
            </div>

            {error && (
              <div className="alert">
                <AlertTriangle size={20} />
                <div>
                  <strong>{error}</strong>
                  {missingArtifacts.length > 0 && (
                    <ul>
                      {missingArtifacts.map((artifact) => (
                        <li key={artifact}>{artifact}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {!prediction && !error && (
              <div className="empty-state">
                <FileImage size={34} />
                <strong>Sin inferencia ejecutada</strong>
                <span>El resultado aparecera aqui cuando el microservicio responda.</span>
              </div>
            )}

            {prediction && (
              <div className="prediction-card">
                <div className="prediction-header">
                  <div>
                    <span>ID de prediccion</span>
                    <strong>{prediction.prediction_id}</strong>
                  </div>
                  <span className="state-badge">{prediction.status}</span>
                </div>

                <div className="metrics-grid">
                  <div>
                    <span>Imagen</span>
                    <strong>{prediction.image.filename}</strong>
                  </div>
                  <div>
                    <span>Resolucion</span>
                    <strong>
                      {prediction.image.width} x {prediction.image.height}
                    </strong>
                  </div>
                  <div>
                    <span>Vertebras</span>
                    <strong>{prediction.predicted_labels.length}</strong>
                  </div>
                  <div>
                    <span>Ultima visible</span>
                    <strong>{prediction.pred_last_label ?? "Sin estimacion"}</strong>
                  </div>
                  <div>
                    <span>Variante</span>
                    <strong>{prediction.pipeline_variant}</strong>
                  </div>
                  <div>
                    <span>Caso</span>
                    <strong>{prediction.case_type}</strong>
                  </div>
                </div>

                <div className="policy-box">
                  <span>Politica final</span>
                  <strong>{prediction.clipping_policy}</strong>
                  <p>
                    Modelos: {Object.values(prediction.model_versions).filter(Boolean).join(", ")}
                  </p>
                </div>

                <div className="labels-box">
                  <span>Etiquetas detectadas</span>
                  {prediction.predicted_labels.length > 0 ? (
                    <div className="label-list">
                      {prediction.predicted_labels.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                  ) : (
                    <p>{prediction.message}</p>
                  )}
                </div>

                {prediction.trimmed_labels.length > 0 && (
                  <div className="labels-box">
                    <span>Etiquetas removidas por clipping</span>
                    <div className="label-list muted">
                      {prediction.trimmed_labels.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                  </div>
                )}

                {isDisplayableImagePath(prediction.preview_path) && (
                  <div className="output-media">
                    <figure>
                      <img src={getBackendAssetUrl(prediction.preview_path)} alt="Vista previa de segmentacion con etiquetas vertebrales" />
                      <figcaption>Vista previa segmentada</figcaption>
                    </figure>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
