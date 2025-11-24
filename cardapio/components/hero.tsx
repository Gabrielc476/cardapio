import Image from "next/image";

export function Hero() {
  return (
    <section className="text-center py-10 px-5">
      <Image
        src="/img/logo.png"
        alt="Logo da Lanchonete"
        width={200}
        height={200}
        className="rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl text-muted-foreground font-['Montserrat']">
        O melhor hambúrguer da cidade!
      </h2>
    </section>
  );
}
