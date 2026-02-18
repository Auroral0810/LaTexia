import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: '隐私政策',
  description: 'Latexia 隐私政策',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-16 sm:py-24">
          <div className="mx-auto max-w-3xl animate-slide-up">
            <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">隐私政策</h1>
            <p className="text-sm text-muted-foreground mb-12">最近更新：2026 年 2 月 18 日</p>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. 概述</h2>
                <p>
                  Latexia（以下简称"我们"）尊重您的隐私，并致力于保护您的个人信息。
                  本隐私政策说明了我们在您使用 Latexia 平台（以下简称"服务"）时，
                  如何收集、使用、存储和保护您的信息。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. 信息收集</h2>
                <p className="mb-3">我们可能收集以下类型的信息：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-foreground">账户信息</strong>：注册时提供的用户名、邮箱地址。</li>
                  <li><strong className="text-foreground">使用数据</strong>：练习记录、学习进度、访问日志。</li>
                  <li><strong className="text-foreground">设备信息</strong>：浏览器类型、操作系统、IP 地址。</li>
                  <li><strong className="text-foreground">第三方登录</strong>：通过 GitHub/Google 登录时，我们获取您授权的公开资料。</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. 信息用途</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>提供、改进和个性化服务</li>
                  <li>记录学习进度与练习成绩</li>
                  <li>发送重要通知（如服务变更）</li>
                  <li>分析使用趋势以优化产品</li>
                  <li>防止欺诈和保障安全</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. 数据存储与安全</h2>
                <p>
                  我们采取合理的技术和组织措施保护您的数据安全，
                  包括但不限于数据加密传输（TLS/SSL）、密码哈希存储、访问控制等。
                  您的数据存储在安全的服务器上，未经您的同意，我们不会将您的个人信息出售或出租给第三方。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookie 使用</h2>
                <p>
                  我们使用 Cookie 和类似技术来维持您的登录状态、记住您的偏好设置。
                  您可以通过浏览器设置管理 Cookie，但禁用可能影响部分功能的使用。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. 您的权利</h2>
                <p>您有权：</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>访问和更新您的个人信息</li>
                  <li>删除您的账户和相关数据</li>
                  <li>导出您的学习数据</li>
                  <li>撤回同意</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. 开源声明</h2>
                <p>
                  Latexia 是一个开源项目，源代码托管在{' '}
                  <a href="https://github.com/Auroral0810/LaTexia" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    GitHub
                  </a>{' '}
                  上。您可以审查我们的代码以了解数据处理的具体实现。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. 联系我们</h2>
                <p>
                  如果您对本隐私政策有任何疑问，请通过以下方式联系我们：
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>邮箱：<a href="mailto:15968588744@163.com" className="text-primary hover:underline">15968588744@163.com</a></li>
                  <li>GitHub：<a href="https://github.com/Auroral0810/LaTexia" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Auroral0810/LaTexia</a></li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
