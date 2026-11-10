import { PLATFORM } from '../../../environments/platform';
import type { Platform } from '../../../environments/platform.model';

/**
 * True when an item tagged with `platforms` belongs in this build.
 * Items with no `platforms` tag are shared and appear on every platform.
 */
export function isOnPlatform(platforms?: readonly Platform[]): boolean {
  return !platforms || platforms.includes(PLATFORM);
}
