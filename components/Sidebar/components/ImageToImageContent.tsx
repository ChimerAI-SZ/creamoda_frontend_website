import { ImageUploadForm } from './ImageUploadForm';

export function ImageToImageContent() {
  return (
    <div className="h-full">
      <ImageUploadForm onSubmit={data => console.log(data)} />
    </div>
  );
}
