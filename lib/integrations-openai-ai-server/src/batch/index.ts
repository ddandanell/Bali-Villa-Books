import pLimit from "p-limit";
import pRetry from "p-retry";
export async function batchProcess<T, R>(items: T[], processor: (item: T) => Promise<R>, options: { concurrency?: number; retries?: number } = {}): Promise<R[]> {
  const limit = pLimit(options.concurrency ?? 2);
  return Promise.all(items.map((item) => limit(() => pRetry(() => processor(item), { retries: options.retries ?? 3 }))));
}
export const isRateLimitError = (error: unknown): boolean => typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 429;
export type BatchOptions = { concurrency?: number; retries?: number };
export const batchProcessWithSSE = batchProcess;