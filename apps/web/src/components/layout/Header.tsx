import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">Latexia</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/practice" className="transition-colors hover:text-foreground/80 text-foreground/60">练习</Link>
          <Link href="/learn" className="transition-colors hover:text-foreground/80 text-foreground/60">教学</Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">关于</Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">
            登录
          </Link>
          <Link href="/register" className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/90">
            注册
          </Link>
        </div>
      </div>
    </header>
  );
}
