import Header from "../Header";

export default function HeaderExample() {
  return (
    <div className="min-h-[200px] bg-background">
      <Header />
      <div className="pt-20 p-8 text-center text-muted-foreground">
        Header component with navigation and auth buttons
      </div>
    </div>
  );
}
