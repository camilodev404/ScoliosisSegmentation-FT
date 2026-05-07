import type { ApiErrorPayload, HealthResponse, PredictionResponse } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  status: number;
  missingArtifacts: string[];

  constructor(message: string, status: number, missingArtifacts: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.missingArtifacts = missingArtifacts;
  }
}

async function parseApiError(response: Response): Promise<ApiError> {
  let message = `Solicitud fallida con estado ${response.status}`;
  let missingArtifacts: string[] = [];

  try {
    const payload = (await response.json()) as ApiErrorPayload;
    if (typeof payload.detail === "string") {
      message = payload.detail;
    } else if (payload.detail?.message) {
      message = payload.detail.message;
      missingArtifacts = payload.detail.missing_artifacts ?? [];
    }
  } catch {
    message = response.statusText || message;
  }

  return new ApiError(message, response.status, missingArtifacts);
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw await parseApiError(response);
  }
  return response.json() as Promise<HealthResponse>;
}

export async function predictImage(image: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json() as Promise<PredictionResponse>;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

