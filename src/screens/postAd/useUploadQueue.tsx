import {useState, useRef, useCallback, useEffect} from 'react';
import {compressImage} from '../../helpers/ImageCompressor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const QUEUE_KEY = 'UPLOAD_QUEUE';
const MAX_CONCURRENT = 3;

export function useUploadQueue(
  uploadUrl: string,
  token: any,
  extraHeaders = {},
) {
  const [queue, setQueue] = useState([]); // {id, uri, status, progress, adId}
  const activeUploads = useRef(0);

  // 🔹 Load persisted queue on app start
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(QUEUE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset status for unfinished uploads
        const restored = parsed.map((f: {status: string}) =>
          f.status === 'uploading' || f.status === 'queued'
            ? {...f, status: 'queued', progress: 0}
            : f,
        );
        setQueue(restored);
      }
    })();
  }, []);

  // 🔹 Persist queue whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  // --- Add image to queue (with compression) ---
  const addToQueue = useCallback(async (uri: string, adId: any) => {
    const id = Date.now().toString();

    const compressedUri = await compressImage(uri);

    const newItem = {
      id,
      uri: compressedUri,
      status: 'queued',
      progress: 0,
      adId,
    };
    // @ts-ignore
    setQueue(prev => [...prev, newItem]);
  }, []);

  // --- Upload with axios ---
  const uploadFile = async (file: {uri: any; id: any; adId: any}) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: `photo_${file.id}.jpg`,
      type: 'image/jpeg',
    });
    formData.append('adId', file.adId); // attach adId with every image

    await axios.post(uploadUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        ...extraHeaders,
      },
      onUploadProgress: progressEvent => {
        const percent = Math.round(
          // @ts-ignore
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        // @ts-ignore
        setQueue(prev =>
          // @ts-ignore
          prev.map(f => (f.id === file.id ? {...f, progress: percent} : f)),
        );
      },
      timeout: 60000,
    });
  };

  // --- Retry wrapper ---
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const retryUpload = async (file: never, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await uploadFile(file);
      } catch (e) {
        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, 2000 * (i + 1))); // exponential backoff
        } else {
          throw e;
        }
      }
    }
  };

  // --- Process queue ---
  const processQueue = useCallback(async () => {
    if (activeUploads.current >= MAX_CONCURRENT) return;

    const next = queue.find((item: any) => item.status === 'queued');
    if (!next) return;

    activeUploads.current++;
    // @ts-ignore
    setQueue(prev =>
      // @ts-ignore
      prev.map(f => (f.id === next.id ? {...f, status: 'uploading'} : f)),
    );

    try {
      await retryUpload(next);
      // @ts-ignore
      setQueue(prev =>
        prev.map(f =>
          // @ts-ignore
          f.id === next.id ? {...f, status: 'success', progress: 100} : f,
        ),
      );
    } catch (err) {
      // @ts-ignore
      setQueue(prev =>
        // @ts-ignore
        prev.map(f => (f.id === next.id ? {...f, status: 'failed'} : f)),
      );
    } finally {
      activeUploads.current--;
      processQueue(); // keep pipeline flowing
    }
  }, [queue, retryUpload]);

  const start = useCallback(() => {
    for (let i = 0; i < MAX_CONCURRENT; i++) {
      processQueue();
    }
  }, [processQueue]);

  return {queue, addToQueue, start};
}
