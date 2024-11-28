"use client";

type Props = {
  children: React.ReactNode;
  params: {
    question: string
    category: string; // Dynamic parameter for the layout
  };
};


export default function ReviewLayout({ children, params }: Props) {
  const category = params.category || "Miscellaneous";

  return (
    <div>
      <header>
        <h1>Reviewing Category: {category}</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}