/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getPlaylistTracks } from "@/lib/spotify";
import { savePlaylistBackup, getBackupFilePath } from "@/lib/playlist-backup";

const PLAYLIST_ID = "3Fpf3LeKFu8mrPR0XeBuM4";

/**
 * POST endpoint to manually create a backup of the playlist tracks
 * This should be called manually when you want to update the backup
 *
 * Usage: POST /api/spotify/playlist/backup
 */
export async function POST() {
  try {
    console.log("[Backup API] Starting backup creation...");
    const startTime = performance.now();

    // Fetch all tracks from Spotify
    let tracks;
    try {
      tracks = await getPlaylistTracks(PLAYLIST_ID);
    } catch (error: any) {
      console.error("[Backup API] Error fetching tracks:", error);
      return NextResponse.json(
        {
          error:
            error.message || "Failed to fetch playlist tracks from Spotify",
          message: "Could not create backup - API request failed",
        },
        { status: 500 }
      );
    }

    // Ensure tracks is an array
    if (!Array.isArray(tracks)) {
      return NextResponse.json(
        {
          error: "Invalid tracks data received",
          message: "Could not create backup - invalid data format",
        },
        { status: 500 }
      );
    }

    // Save to backup file
    await savePlaylistBackup(tracks, PLAYLIST_ID);

    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    return NextResponse.json({
      success: true,
      message: "Backup created successfully",
      trackCount: tracks.length,
      duration: `${duration}s`,
      backupPath: getBackupFilePath(),
      savedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Backup API] Unexpected error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create backup",
        message: "An unexpected error occurred while creating backup",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check backup status
 */
export async function GET() {
  try {
    const { loadPlaylistBackup } = await import("@/lib/playlist-backup");
    const backup = await loadPlaylistBackup();

    if (!backup) {
      return NextResponse.json({
        exists: false,
        message: "No backup file found",
        backupPath: getBackupFilePath(),
      });
    }

    return NextResponse.json({
      exists: true,
      metadata: backup.metadata,
      trackCount: backup.tracks.length,
      backupPath: getBackupFilePath(),
    });
  } catch (error: any) {
    console.error("[Backup API] Error checking backup:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to check backup status",
      },
      { status: 500 }
    );
  }
}
