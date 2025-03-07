import { OutfitForm } from './OutfitForm';

export function TextToImageContent() {
  return (
    <div className="h-full overflow-y-auto">
      <OutfitForm onSubmit={data => console.log(data)} />
    </div>
  );
}
