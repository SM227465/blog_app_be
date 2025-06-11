import AppError from '../utils/app-error.util';
import catchAsync from '../utils/catch-async.util';
import WebTorrent from 'webtorrent';

interface TorrentFile {
  name: string;
  path: string;
  length: number;
}

interface TorrentResponse {
  name: string;
  infoHash: string;
  magnetURI: string;
  totalSize: number;
  peers: number;
  files: TorrentFile[];
  formatedSize: string;
}

const client = new WebTorrent();

export const getTorrentInfo = catchAsync(async (req, res, next) => {
  const { magnetLink } = req.body;

  if (!magnetLink) {
    return next(new AppError('Missing magnet URL. Please provide a "magnet" property in the request body', 400));
  }

  try {
    const torrentInfo = await fetchTorrentInfo(magnetLink);

    res.status(200).json({
      success: true,
      data: torrentInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to get torrent info: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
});

function fetchTorrentInfo(magnetURI: string): Promise<TorrentResponse> {
  return new Promise((resolve, reject) => {
    // Set timeout for metadata fetch (30 seconds)
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout: Metadata fetch took too long'));
    }, 30000);

    // Add torrent to client
    const torrent = client.add(magnetURI, {});

    // Cleanup function to remove torrent and clear timeout
    function cleanup() {
      clearTimeout(timeoutId);

      if (client.get(torrent.infoHash)) {
        torrent.destroy();
      }
    }

    // Handle errors
    torrent.on('error', (err) => {
      cleanup();
      reject(err);
    });

    // Wait for metadata
    torrent.on('metadata', () => {
      const response: TorrentResponse = {
        name: torrent.name,
        infoHash: torrent.infoHash,
        magnetURI: torrent.magnetURI,
        totalSize: torrent.length,
        peers: torrent.numPeers,
        formatedSize: formatBytes(torrent.length),
        files: torrent.files.map((file) => ({
          name: file.name,
          path: file.path,
          length: file.length,
        })),
      };

      cleanup();
      resolve(response);
    });
  });
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
