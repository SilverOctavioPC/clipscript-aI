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
