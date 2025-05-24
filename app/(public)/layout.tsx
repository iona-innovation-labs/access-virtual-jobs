// app/(public)/layout.tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main>{children}</main>
      </div>
    );
  }
  