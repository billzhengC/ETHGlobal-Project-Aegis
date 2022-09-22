import SimpleFooter from "./simpleFooter";
import SimpleHeader from "./simpleHeader";

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full h-full mx-auto flex-1 flex flex-col">
      <SimpleHeader />
      <main className="relative w-full flex-1 flex flex-col">{children}</main>
      <SimpleFooter />
    </div>
  );
}
