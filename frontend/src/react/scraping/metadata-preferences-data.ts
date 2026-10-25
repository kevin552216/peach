import { apiGet } from '../../api';

export const METADATA_PREFERENCES_URL = '/api/metadata-preferences';
export const METADATA_PREFERENCES_KEY = ['metadata-preferences'];
export interface MetadataPreferencesData {
  user_agent: string; default_user_agent: string; routes: Record<string, string[]>;
  types: { id: string; sources: { id: string; label: string }[] }[];
}
export const fetchMetadataPreferences = (signal?: AbortSignal) =>
  apiGet<MetadataPreferencesData>(METADATA_PREFERENCES_URL, signal);
