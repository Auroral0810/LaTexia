"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

// 默认验证码字符集
const CHAR_SET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"

export interface GraphicCaptchaProps {
  /** 验证码字符长度，默认 4 */
  length?: number
  /** 画布宽度 */
  width?: number
  /** 画布高度 */
  height?: number
  /** 验证码变更回调，返回当前正确答案 */
  onCaptchaChange?: (answer: string) => void
  /** 额外样式 */
  className?: string
}

/**
 * 图形验证码组件
 * - Canvas 绘制随机字符 + 干扰线 + 噪点
 * - 点击刷新
 * - 通过 onCaptchaChange 回调返回正确答案供父组件校验
 */
const GraphicCaptcha = React.forwardRef<HTMLCanvasElement, GraphicCaptchaProps>(
  ({ length = 4, width = 120, height = 40, onCaptchaChange, className }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [answer, setAnswer] = React.useState("")

    // 合并 ref
    React.useImperativeHandle(ref, () => canvasRef.current!)

    // 生成随机验证码字符串
    const generateCode = React.useCallback(() => {
      let code = ""
      for (let i = 0; i < length; i++) {
        code += CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]
      }
      return code
    }, [length])

    // 随机颜色
    const randomColor = (min: number, max: number) => {
      const r = Math.floor(Math.random() * (max - min) + min)
      const g = Math.floor(Math.random() * (max - min) + min)
      const b = Math.floor(Math.random() * (max - min) + min)
      return `rgb(${r},${g},${b})`
    }

    // 绘制验证码
    const draw = React.useCallback((code: string) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // 背景
      ctx.fillStyle = randomColor(220, 255)
      ctx.fillRect(0, 0, width, height)

      // 绘制字符
      const fontSize = height * 0.6
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textBaseline = "middle"
      const charWidth = width / (length + 1)
      for (let i = 0; i < code.length; i++) {
        ctx.fillStyle = randomColor(50, 160)
        ctx.save()
        const x = charWidth * (i + 0.5)
        const y = height / 2
        const angle = (Math.random() - 0.5) * 0.5
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.fillText(code[i], 0, 0)
        ctx.restore()
      }

      // 干扰线
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = randomColor(100, 200)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(Math.random() * width, Math.random() * height)
        ctx.lineTo(Math.random() * width, Math.random() * height)
        ctx.stroke()
      }

      // 噪点
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(Math.random() * width, Math.random() * height, 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    }, [width, height, length])

    const refresh = React.useCallback(() => {
      const newCode = generateCode()
      setAnswer(newCode)
      onCaptchaChange?.(newCode)
      draw(newCode)
    }, [generateCode, onCaptchaChange, draw])

    // 初始绘制
    React.useEffect(() => {
      const initialCode = generateCode()
      setAnswer(initialCode)
      onCaptchaChange?.(initialCode)
      draw(initialCode)
      // 注意：这里我们确实希望只在载入时运行一次
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={() => refresh()}
        title="点击刷新验证码"
        className={cn("cursor-pointer rounded-md border border-input select-none bg-white", className)}

      />
    )
  }
)
GraphicCaptcha.displayName = "GraphicCaptcha"

export { GraphicCaptcha }
