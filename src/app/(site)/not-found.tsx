import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="section-padding min-h-[60vh] flex items-center justify-center">
      <div className="container-main text-center">
        <p className="text-6xl md:text-8xl font-extrabold font-display text-accent-cyan">
          404
        </p>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold font-display text-text">
          Страница не найдена
        </h1>
        <p className="mt-3 text-text-secondary max-w-md mx-auto">
          Возможно, страница была перемещена или удалена. Перейдите на главную или выберите услугу из меню.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" href="/">
            На главную
          </Button>
          <Button variant="secondary" href="/portfolio">
            Портфолио
          </Button>
        </div>
      </div>
    </section>
  );
}
