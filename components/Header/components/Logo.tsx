import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center h-[20px] w-[155px]">
      <Image src="/images/logo-black.svg" alt="Logo" width={155} height={20} />
    </div>
  );
}
