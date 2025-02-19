import { GoogleCallback } from "./callback";

export default function GoogleAuthPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <GoogleCallback />
    </div>
  );
}
