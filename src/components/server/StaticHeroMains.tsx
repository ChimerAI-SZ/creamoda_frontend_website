import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';

const instrumentSansItalic = localFont({
  src: '../../../public/marketing/fonts/InstrumentSans-Italic-Variable.ttf',
  variable: '--font-instrument-sans-italic',
  display: 'swap',
});

interface StaticHeroMainsProps {
  className?: string;
}

export default function StaticHeroMains({ className = '' }: StaticHeroMainsProps) {
  return (
    <section className={`w-full h-[80vh] md:h-screen -mt-10 md:mt-0 overflow-hidden relative ${className}`}>
      {/* 背景视频层 */}
      <div className="absolute inset-0">
        <video
          src="/marketing/images/hero/bg.webm"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* 时尚图片网格 - 底部全宽自适应 */}
      <div className="absolute -left-2 -right-2 bottom-0 flex items-end justify-center pb-[30px] md:pb-[50px] gap-1 md:gap-2">
        {/* 底部黑色羽化效果 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10"></div>
        
        {/* 桌面端布局 - 隐藏在移动端 */}
        <div className="hidden md:contents">
          {/* 第一列 - 最短可视高度，下移最多 */}
          <div className="flex-1 flex flex-col items-end">
            <div className="relative w-full h-[36vh] lg:h-[40vh] rounded-lg overflow-hidden opacity-50 transform translate-y-[16vh] lg:translate-y-[20vh]">
              <Image
                src="/marketing/images/main/hero/one.png"
                alt="Fashion item 1"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第二列 - 第二高可视高度 */}
          <div className="flex-1 flex flex-col items-end">
            <div className="relative w-full h-[34vh] lg:h-[42vh] rounded-lg overflow-hidden opacity-70 transform translate-y-[7vh] lg:translate-y-[10vh]">
              <Image
                src="/marketing/images/main/hero/two.png"
                alt="Fashion item 2"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第三列 - 中等偏小可视高度 */}
          <div className="flex-1 flex flex-col items-end">
            <div className="relative w-full h-[35vh] lg:h-[44vh] rounded-lg overflow-hidden transform translate-y-[12vh] lg:translate-y-[18vh]">
              <Image
                src="/marketing/images/main/hero/three.png"
                alt="Fashion item 3"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第四列 - 最高可视高度，下移最少 */}
          <div className="flex-1 flex flex-col items-end">
            <div className="relative w-full h-[38vh] lg:h-[49vh] rounded-lg overflow-hidden transform translate-y-[9vh] lg:translate-y-[14vh]">
              <Image
                src="/marketing/images/main/hero/four.png"
                alt="Fashion item 4"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第五列 - 中等可视高度 */}
          <div className="flex-1 flex flex-col items-end">
            <div className="relative w-full h-[28vh] lg:h-[36vh] rounded-lg overflow-hidden opacity-70 transform translate-y-[4vh] lg:translate-y-[6vh]">
              <Image
                src="/marketing/images/main/hero/five.png"
                alt="Fashion item 5"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第六列 - 中等偏小可视高度 */}
          <div className="flex-1 flex flex-col items-end">
            <div className="relative w-full h-[35vh] lg:h-[46vh] rounded-lg overflow-hidden opacity-70 transform translate-y-[14vh] lg:translate-y-[21vh]">
              <Image
                src="/marketing/images/main/hero/six.png"
                alt="Fashion item 6"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第七列 - 中等可视高度 */}
          <div className="flex-1 flex flex-col items-end">
            <div className="relative w-full h-[36vh] lg:h-[47vh] rounded-lg overflow-hidden opacity-40 transform translate-y-[12vh] lg:translate-y-[18vh]">
              <Image
                src="/marketing/images/main/hero/seven.png"
                alt="Fashion item 7"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* 移动端布局 - 参照 Figma 设计 */}
        <div className="md:hidden flex items-end justify-center gap-1">
          {/* 第一列 - 左侧双图堆叠 */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-[88px] h-[125px] rounded overflow-hidden opacity-70">
              <Image
                src="/marketing/images/main/hero/one.png"
                alt="Fashion item 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[88px] h-[40px] rounded overflow-hidden opacity-70">
              <Image
                src="/marketing/images/main/hero/two.png"
                alt="Fashion item 2"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第二列 - 中间单独高图 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[82px] h-[135px] rounded overflow-hidden opacity-50">
              <Image
                src="/marketing/images/main/hero/three.png"
                alt="Fashion item 3"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第三列 - 中心主图 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[90px] h-[155px] rounded overflow-hidden">
              <Image
                src="/marketing/images/main/hero/four.png"
                alt="Fashion item 4"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第四列 - 右侧双图堆叠 */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-[88px] h-[128px] rounded overflow-hidden">
              <Image
                src="/marketing/images/main/hero/five.png"
                alt="Fashion item 5"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[92px] h-[50px] rounded overflow-hidden">
              <Image
                src="/marketing/images/main/hero/six.png"
                alt="Fashion item 6"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第五列 - 右侧双图堆叠 */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-[88px] h-[120px] rounded overflow-hidden opacity-70">
              <Image
                src="/marketing/images/main/hero/seven.png"
                alt="Fashion item 7"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[88px] h-[46px] rounded overflow-hidden opacity-70">
              <Image
                src="/marketing/images/main/hero/one.png"
                alt="Fashion item 1"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第六列 - 右边缘高图 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[88px] h-[165px] rounded overflow-hidden opacity-40">
              <Image
                src="/marketing/images/main/hero/two.png"
                alt="Fashion item 2"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* 第七列 - 最右侧单图 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[90px] h-[150px] rounded overflow-hidden opacity-70">
              <Image
                src="/marketing/images/main/hero/three.png"
                alt="Fashion item 3"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      {/* 中心内容区域 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full flex flex-col items-center gap-6 md:gap-8 transform md:-translate-y-20 lg:-translate-y-32 -translate-y-12 px-4">
          {/* 标题和副标题 */}
          <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
            <h1 className="text-white md:text-[56px] lg:text-[76px] text-[42px] font-normal md:leading-[68px] lg:leading-[94px] leading-[48px] text-center font-['Inspiration'] drop-shadow-[0_0_50px_rgba(0,0,0,0.25)]">
              From Idea to <span className={instrumentSansItalic.className}>Bestseller</span><br />
              in 24 Hours
            </h1>
            <p className="text-white/70 md:text-lg lg:text-xl text-base font-medium md:leading-[22px] lg:leading-[24px] leading-[20px] text-center max-w-sm md:max-w-none">
              Reimagine Fashion with All-in-One AI-powered Solution
            </p>
          </div>

          {/* 两个操作按钮 */}
          <div className="flex flex-row items-center gap-2 md:gap-4">
            {/* Chat With Fashion Agent 按钮 - 半透明样式 */}
            <Link
              href="/fashion-agent"
              className="flex items-center justify-center gap-2 md:px-4 lg:px-5 px-4 md:py-2.5 lg:py-3 py-2.5 rounded-lg transition-all duration-200 group"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.10)',
                backdropFilter: 'blur(27px)'
              }}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-white md:text-base lg:text-lg text-sm font-semibold">Chat With Fashion Agent</span>
              </div>
              <div className="md:w-5 lg:w-6 md:h-5 lg:h-6 w-5 h-5 flex items-center justify-center">
                <Image
                  src="/marketing/images/msg.svg"
                  alt="Message"
                  width={20}
                  height={20}
                  className="md:w-[18px] lg:w-[20px] md:h-[18px] lg:h-[20px] w-[16px] h-[16px]"
                />
              </div>
            </Link>

            {/* Start With Creative Tools 按钮 - 白底黑字样式 */}
            <Link
              href="/designs"
              className="flex items-center justify-center gap-2 md:px-4 lg:px-5 px-4 md:py-2.5 lg:py-3 py-2.5 bg-white rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200 group"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-black md:text-base lg:text-lg text-sm font-semibold">Start With Creative Tools</span>
              </div>
              <div className="md:w-5 lg:w-6 md:h-5 lg:h-6 w-5 h-5 flex items-center justify-center">
                <Image
                  src="/marketing/images/hero/narrow.svg"
                  alt="Arrow"
                  width={17}
                  height={16}
                  className="md:w-[15px] lg:w-[17px] md:h-[14px] lg:h-[16px] w-[14px] h-[13px] group-hover:translate-x-1 transition-transform duration-200"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
