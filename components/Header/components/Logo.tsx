import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image src="/placeholder.svg?height=32&width=32" alt="Creamoda Logo" width={32} height={32} />
      <span className="ml-2 text-xl font-bold">CREAMODA</span>
    </div>
  );
}
