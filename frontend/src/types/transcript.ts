export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptResponse {
  text: string;
  segments: TranscriptSegment[];
}

export interface TranscribeRequest {
  url: string;
}

export interface VideoFormat {
  height: number;
  resolutionText: string;
  approxMb: number | null;
}

export interface VideoInfoResponse {
  title: string;
  duration: number;
  thumbnail: string;
  formats: VideoFormat[];
}
