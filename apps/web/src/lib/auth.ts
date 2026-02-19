import { api } from './api-client';

// ========== 认证接口响应类型 ==========

interface AuthResponse {
  success: boolean;
  data?: {
    user?: {
      id: string;
      username: string;
      email?: string;
      phone?: string;
      role: string;
      avatarUrl?: string;
      bio?: string;
      locale?: string;
      theme?: string;
      createdAt?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    message?: string;
  };
  message?: string;
}

// ========== 发送验证码 ==========

/**
 * 发送验证码至邮箱或手机号
 * @param target 邮箱或手机号
 * @param type 用途：register / login / reset
 */
export async function sendCode(target: string, type: 'register' | 'login' | 'reset'): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/send-code', { target, type });
  } catch (err: any) {
    return { success: false, message: err.message || '发送失败' };
  }
}

// ========== 注册 ==========

export async function register(
  username: string,
  target: string,
  code: string,
  password: string
): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/register', { username, target, code, password });
  } catch (err: any) {
    return { success: false, message: err.message || '注册失败' };
  }
}

// ========== 密码登录 ==========

export async function loginByPassword(identifier: string, password: string): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/login', { identifier, password });
  } catch (err: any) {
    return { success: false, message: err.message || '登录失败' };
  }
}

// ========== 验证码登录 ==========

export async function loginByCode(target: string, code: string): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/login/code', { target, code });
  } catch (err: any) {
    return { success: false, message: err.message || '登录失败' };
  }
}

// ========== 忘记密码（发送重置验证码） ==========

export async function forgotPassword(target: string): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/forgot-password', { target });
  } catch (err: any) {
    return { success: false, message: err.message || '发送失败' };
  }
}

// ========== 重置密码 ==========

export async function resetPassword(target: string, code: string, newPassword: string): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/reset-password', { target, code, newPassword });
  } catch (err: any) {
    return { success: false, message: err.message || '重置失败' };
  }
}

// ========== 刷新 Token ==========

export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/refresh', { refreshToken });
  } catch (err: any) {
    return { success: false, message: err.message || '刷新失败' };
  }
}

// ========== 退出登录 ==========

export async function logout(refreshToken: string): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/logout', { refreshToken });
  } catch (err: any) {
    return { success: false, message: err.message || '退出失败' };
  }
}

// ========== 获取个人资料 ==========

export async function getProfile(userId: string): Promise<AuthResponse> {
  try {
    return await api.get<AuthResponse>('/api/auth/profile', {
      headers: { 'X-User-Id': userId }
    });
  } catch (err: any) {
    return { success: false, message: err.message || '获取失败' };
  }
}

// ========== 更新个人资料 ==========

export async function updateProfile(userId: string, data: any): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/profile/update', data, {
      headers: { 'X-User-Id': userId }
    });
  } catch (err: any) {
    return { success: false, message: err.message || '更新失败' };
  }
}

// ========== 修改密码 ==========

export async function changePassword(userId: string, data: any): Promise<AuthResponse> {
  try {
    return await api.post<AuthResponse>('/api/auth/change-password', data, {
      headers: { 'X-User-Id': userId }
    });
  } catch (err: any) {
    return { success: false, message: err.message || '修改失败' };
  }
}
