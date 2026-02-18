import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: '服务条款',
  description: 'Latexia 服务条款',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-16 sm:py-24">
          <div className="mx-auto max-w-3xl animate-slide-up">
            <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">服务条款</h1>
            <p className="text-sm text-muted-foreground mb-12">最近更新：2026 年 2 月 18 日</p>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. 接受条款</h2>
                <p>
                  欢迎使用 Latexia。使用本服务即表示您同意受本服务条款的约束。
                  如果您不同意这些条款，请不要使用本服务。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. 服务描述</h2>
                <p>
                  Latexia 是一个在线 LaTeX 学习与练习平台，提供交互式练习、系统化教程、
                  符号查询和竞技排名等功能。本服务以"现状"提供，我们会持续改进和更新服务内容。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. 用户账户</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>您需要注册账户才能使用部分功能。</li>
                  <li>您有责任维护账户的安全性和保密性。</li>
                  <li>您对账户下的所有活动负责。</li>
                  <li>请提供准确的注册信息。</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. 使用规范</h2>
                <p className="mb-3">使用本服务时，您同意不会：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>违反任何适用的法律法规</li>
                  <li>干扰或破坏服务的正常运行</li>
                  <li>未经授权访问其他用户的账户或数据</li>
                  <li>上传恶意代码或有害内容</li>
                  <li>利用服务进行任何非法活动</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. 知识产权</h2>
                <p>
                  Latexia 平台的源代码采用 MIT 许可证开源。用户创建的内容（如练习答案、笔记）
                  归用户所有。平台提供的教程和题库内容的版权归 Latexia 团队所有。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. 免责声明</h2>
                <p>
                  本服务按"现状"提供，不作任何明示或暗示的保证。
                  对于因使用本服务而导致的任何直接、间接、偶然损失，
                  我们不承担责任。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. 服务变更</h2>
                <p>
                  我们保留随时修改或终止服务（或其部分功能）的权利，
                  无论是否事先通知。对于服务的修改、暂停或终止，
                  我们不对您或任何第三方承担责任。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. 条款更新</h2>
                <p>
                  我们可能会不时更新本服务条款。更新后继续使用服务即表示您接受修改后的条款。
                  我们建议您定期查阅本页面以了解最新条款。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. 联系方式</h2>
                <p>
                  如果您对本服务条款有任何疑问，请通过
                  <a href="mailto:15968588744@163.com" className="text-primary hover:underline"> 15968588744@163.com </a>
                  联系我们。
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
