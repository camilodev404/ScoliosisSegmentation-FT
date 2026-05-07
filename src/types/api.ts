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
  vertebrae: VertebraInfo[];
  mask_path: string | null;
  preview_path: string | null;
  message: string;
};

export type ApiErrorPayload = {
  detail?: string | {
    message?: string;
    missing_artifacts?: string[];
  };
};
