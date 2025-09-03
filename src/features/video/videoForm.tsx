'use client';

import { RefObject, useActionState, useEffect, useRef } from 'react';
import { saveVideo } from './actions/saveVideo';
import { format } from 'date-fns';

export const VideoForm = ({
  videoPreview,
  blob,
}: {
  videoPreview: RefObject<HTMLVideoElement | null>;
  blob: Blob | null;
}) => {
  const currentDate = format(new Date(), 'yyyy-MM-dd ');
  const [actionState, formAction] = useActionState(saveVideo, '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!blob) return;
    const formVideo = new File([blob], 'video.webm', {
      type: 'video/webm',
    });

    const input = fileInputRef.current;
    if (!input) return;

    const dt = new DataTransfer();
    dt.items.add(formVideo);
    input.files = dt.files;
  }, [blob]);

  return (
    <form action={formAction}>
      <video ref={videoPreview} controls></video>
      <div>
        <input
          type="text"
          name="title"
          placeholder="Title"
          defaultValue={currentDate}
        />
        <label htmlFor="title">Title</label>
      </div>
      <div>
        <textarea
          name="description"
          placeholder="Description"
          defaultValue={`video captured on ${currentDate}`}
        />
        <label htmlFor="description">Description</label>
      </div>
      <div>
        <input type="file" name="video" ref={fileInputRef} hidden />
        <label htmlFor="video">Video</label>
      </div>
      <div>
        <button type="submit">Save Video</button>
      </div>
    </form>
  );
};
