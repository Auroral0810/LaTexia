
declare module 'react-katex' {
  import * as React from 'react';

  export interface KatexProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    settings?: any;
    as?: React.ElementType;
    children?: React.ReactNode;
    className?: string; // Add className
  }

  export class InlineMath extends React.Component<KatexProps> {}
  export class BlockMath extends React.Component<KatexProps> {}
}
