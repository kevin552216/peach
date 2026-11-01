import { apiGet, apiSend } from '../../api';
import type { IndexPerson } from '../index/index-data';

export const PERFORMER_DELETE_KEY = ['performer-delete-candidates'] as const;

export interface DeletePerformer extends IndexPerson {
  entity_id: number;
  aliases: string[];
  file_count: number;
  bytes: number;
}

export interface PerformerDeletePlan {
  entity_ids: number[];
  performers: { id: number; name: string }[];
  plan: string;
  total: number;
  bytes: number;
  shared: number;
  items: { id: number; code: string | null; name: string | null }[];
}

export interface PerformerDeleteResult {
  purged: number;
  blocked: { id: number; path: string; reason: string }[];
  cleanup_pending: { path: string; reason: string }[];
  cache_blocked: { name: string; reason: string }[];
}

export const fetchDeletePerformers = (signal: AbortSignal) =>
  apiGet<{ items: DeletePerformer[] }>('/api/performer/delete-candidates', signal);

export const fetchDeletePlan = (ids: number[], signal: AbortSignal) =>
  apiGet<PerformerDeletePlan>(`/api/performer/delete-plan?${new URLSearchParams({ ids: ids.join(',') })}`, signal);

export const deletePerformerVideos = (plan: PerformerDeletePlan) =>
  apiSend<PerformerDeleteResult>('/api/performer/delete', { entity_ids: plan.entity_ids, plan: plan.plan });
