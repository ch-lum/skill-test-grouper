declare module 'react-csv' {
  import * as React from 'react';

  export interface CSVLinkProps {
    data: any;
    headers?: { label: string; key: string }[];
    separator?: string;
    filename?: string;
    uFEFF?: boolean;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void | boolean;
    asyncOnClick?: boolean;
    enclosingCharacter?: string;
    target?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export class CSVLink extends React.Component<CSVLinkProps, any> {}
}