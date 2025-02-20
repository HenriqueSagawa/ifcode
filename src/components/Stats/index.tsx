export function Stats() {

    const stats = [
        {
            data: "0",
            desc: "Dúvidas respondidas"
        },
        {
            data: "0",
            desc: "Estudantes alcançados"
        },
        {
            data: "0",
            desc: "Mentores disponíveis"
        },
        {
            data: "0",
            desc: "Perguntas publicadas"
        },
    ]

    return (
        <section className="py-28 my-32 relative">
            <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="max-w-2xl xl:mx-auto xl:text-center">
                    <h3 className="dark:text-white text-3xl font-semibold sm:text-4xl">
                        A comunidade do IF Code está crescendo
                    </h3>
                    <p className="mt-3 dark:text-gray-300 text-gray-500">
                        Nosso compromisso é ajudar estudantes de informática a evoluírem e superarem desafios juntos. Confira alguns números da nossa plataforma:
                    </p>
                </div>
                <div className="mt-12">
                    <ul className="flex-wrap gap-x-12 gap-y-10 items-center space-y-8 sm:space-y-0 sm:flex xl:justify-center">
                        {
                            stats.map((item, idx) => (
                                <li key={idx} className="sm:max-w-[15rem]">
                                    <h4 className="text-4xl dark:text-white font-semibold">{item.data}</h4>
                                    <p className="mt-3 text-gray-400 font-medium">{item.desc}</p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <div className="absolute inset-0 max-w-md mx-auto h-80 blur-[118px] sm:h-72" style={{ background: "linear-gradient(152.92deg, rgba(137, 255, 173, 0.2) 4.54%, rgba(105, 255, 167, 0.26) 34.2%, rgba(23, 255, 73, 0.1) 77.55%)" }}></div>
        </section>
    )
}