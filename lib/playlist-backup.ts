import { promises as fs } from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), "data");
const BACKUP_FILE = path.join(BACKUP_DIR, "playlist-tracks-backup.json");

export interface BackupMetadata {
  savedAt: string;
  playlistId: string;
  trackCount: number;
}

// Spotify API response structure for playlist items
export interface SpotifyPlaylistItem {
  added_at?: string;
  track: {
    id?: string;
    name?: string;
    uri?: string;
    external_urls?: {
      spotify?: string;
    };
    duration_ms?: number;
    album?: {
      images?: Array<{ url?: string }>;
      name?: string;
    };
    artists?: Array<{
      name?: string;
      external_urls?: {
        spotify?: string;
      };
    }>;
  } | null;
}

export interface PlaylistBackup {
  metadata: BackupMetadata;
  tracks: SpotifyPlaylistItem[];
}

/**
 * Save playlist tracks to backup file
 */
export async function savePlaylistBackup(
  tracks: SpotifyPlaylistItem[],
  playlistId: string
): Promise<void> {
  try {
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const backup: PlaylistBackup = {
      metadata: {
        savedAt: new Date().toISOString(),
        playlistId,
        trackCount: tracks.length,
      },
      tracks,
    };

    await fs.writeFile(BACKUP_FILE, JSON.stringify(backup, null, 2), "utf-8");
    console.log(
      `[Backup] Saved ${tracks.length} tracks to ${BACKUP_FILE} at ${backup.metadata.savedAt}`
    );
  } catch (error) {
    console.error("[Backup] Failed to save backup:", error);
    throw error;
  }
}

/**
 * Load playlist tracks from backup file
 */
export async function loadPlaylistBackup(): Promise<PlaylistBackup | null> {
  try {
    const data = await fs.readFile(BACKUP_FILE, "utf-8");
    const backup: PlaylistBackup = JSON.parse(data);
    console.log(
      `[Backup] Loaded ${backup.metadata.trackCount} tracks from backup (saved at ${backup.metadata.savedAt})`
    );
    return backup;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      console.log("[Backup] No backup file found");
      return null;
    }
    console.error("[Backup] Failed to load backup:", error);
    return null;
  }
}

/**
 * Get backup file path (for informational purposes)
 */
export function getBackupFilePath(): string {
  return BACKUP_FILE;
}
