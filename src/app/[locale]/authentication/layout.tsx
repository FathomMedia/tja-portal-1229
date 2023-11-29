import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 min-h-[100svh]">
      <div className="flex sticky top-0 justify-center h-20 bg-white px-6 py-4 shadow-lg shadow-accent">
        <div className="relative  w-full h-full  max-w-xs">
          <Image
            className="object-contain"
            fill
            src="/assets/images/logo-dark.png"
            alt="Logo"
          />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
