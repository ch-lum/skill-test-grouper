import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; 

interface CodeBlockProps {
  code: string;
  language: string;
  highlightLines?: number[];
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, highlightLines = []}) => {
  //highlightLines = []; // Removed for demo, not working rn
  return (
    <SyntaxHighlighter 
      language={language} 
      style={materialDark}
      wrapLines={true}
      showLineNumbers={true}
      lineProps={(lineNumber: number) => {
        const style: React.CSSProperties = { whiteSpace: 'pre-wrap' };
        if (highlightLines.includes(lineNumber)) {
          style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
        }
        return { style };
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;