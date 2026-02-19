import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

// ========== Nodemailer 传输实例 ==========

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_USE_SSL, // true = SSL (port 465)
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
});

// ========== 模板加载与渲染 ==========

/** 模板缓存 */
const templateCache = new Map<string, string>();

/**
 * 加载并缓存 HTML 模板
 */
function loadTemplate(name: string): string {
  if (templateCache.has(name)) {
    return templateCache.get(name)!;
  }
  const filePath = path.resolve(__dirname, 'templates', `${name}.html`);
  const content = fs.readFileSync(filePath, 'utf-8');
  templateCache.set(name, content);
  return content;
}

/**
 * 渲染模板 — 替换 {{variable}} 占位符
 */
function renderTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

// ========== 邮件发送方法 ==========

/**
 * 发送注册/登录验证码邮件
 */
export async function sendVerificationEmail(to: string, code: string): Promise<void> {
  const template = loadTemplate('verify-email');
  const html = renderTemplate(template, {
    code,
    year: new Date().getFullYear().toString(),
    expireMinutes: '5',
  });

  await transporter.sendMail({
    from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM}>`,
    to,
    subject: `【Latexia】您的验证码：${code}`,
    html,
  });

  console.log(`[Mail] 验证码邮件已发送至 ${to}`);
}

/**
 * 发送密码重置验证码邮件
 */
export async function sendPasswordResetEmail(to: string, code: string): Promise<void> {
  const template = loadTemplate('reset-password');
  const html = renderTemplate(template, {
    code,
    year: new Date().getFullYear().toString(),
    expireMinutes: '5',
  });

  await transporter.sendMail({
    from: `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM}>`,
    to,
    subject: `【Latexia】密码重置验证码：${code}`,
    html,
  });

  console.log(`[Mail] 密码重置邮件已发送至 ${to}`);
}
