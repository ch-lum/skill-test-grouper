import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; 

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <SyntaxHighlighter 
      language={language} 
      style={materialDark}
      wrapLines={true}
      lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
      showLineNumbers={true}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;