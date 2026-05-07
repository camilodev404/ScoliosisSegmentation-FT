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

export type PredictionResponse = {
  prediction_id: string;
  status: string;
  image: PredictionImageInfo;
  predicted_labels: string[];
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

