const test = process.env.OPENAI_API_KEY as string;

export default function DownloadPage() {
  return (
    <div>
      <p>Test: {test}</p>
    </div>
  );
}