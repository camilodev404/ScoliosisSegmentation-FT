export type HealthResponse = {
  status: string;
  service: string;
  model_ready: boolean;
  missing_artifacts: string[];
};

export type PredictionImageInfo = {
  filename: string;
  content_type: string;
  width: number;
  height: number;
  saved_path: string;
};

export type VertebraInfo = {
  label: string;
  mask_id: number;
  bbox: [number, number, number, number];
  centroid: [number, number];
  area_pixels: number;
  orientation_degrees: number | null;
};

export type PredictionResponse = {
  prediction_id: string;
  status: string;
  image: PredictionImageInfo;
  predicted_labels: string[];
  raw_labels: string[];
  trimmed_labels: string[];
  vertebrae: VertebraInfo[];
  mask_path: string | null;
  preview_path: string | null;
  pred_last_label: string | null;
  raw_last_label: string | null;
  pipeline_variant: string;
  clipping_policy: string;
  case_type: "unknown" | "normal" | "scoliosis" | string;
  model_versions: Record<string, string>;
  message: string;
};

export type ApiErrorPayload = {
  detail?: string | {
    message?: string;
    missing_artifacts?: string[];
  };
};
