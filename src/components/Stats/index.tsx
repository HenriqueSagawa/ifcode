/**
 * Componente que exibe as estatísticas da plataforma IF Code.
 *
 * Este componente renderiza uma seção com informações sobre o número de dúvidas respondidas,
 * estudantes alcançados, mentores disponíveis e perguntas publicadas.
 *
 * @returns {JSX.Element} A seção de estatísticas renderizada.
 */
export function Stats() {

    // Array com os dados das estatísticas.
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
            {/* Container principal da seção de estatísticas. */}
            <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8">
                {/* Container para o título e a descrição da seção. */}
                <div className="max-w-2xl xl:mx-auto xl:text-center">
                    <h3 className="dark:text-white text-3xl font-semibold sm:text-4xl">
                        {/* Título da seção. */}
                        A comunidade do IF Code está crescendo
                    </h3>
                    <p className="mt-3 dark:text-gray-300 text-gray-500">
                        {/* Descrição da seção. */}
                        Nosso compromisso é ajudar estudantes de informática a evoluírem e superarem desafios juntos. Confira alguns números da nossa plataforma:
                    </p>
                </div>
                <div className="mt-12">
                    {/* Container para a lista de estatísticas. */}
                    <ul className="flex-wrap gap-x-12 gap-y-10 items-center space-y-8 sm:space-y-0 sm:flex xl:justify-center">
                        {/* Mapeia o array de estatísticas e renderiza um item de lista para cada uma. */}
                        {
                            stats.map((item, idx) => (
                                <li key={idx} className="sm:max-w-[15rem]">
                                    {/* Item de lista para cada estatística. */}
                                    <h4 className="text-4xl dark:text-white font-semibold">{item.data}</h4>
                                    {/* Valor da estatística. */}
                                    <p className="mt-3 text-gray-400 font-medium">{item.desc}</p>
                                    {/* Descrição da estatística. */}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            {/* Efeito visual de fundo (blur). */}
            <div className="absolute inset-0 max-w-md mx-auto h-80 blur-[118px] sm:h-72" style={{ background: "linear-gradient(152.92deg, rgba(137, 255, 173, 0.2) 4.54%, rgba(105, 255, 167, 0.26) 34.2%, rgba(23, 255, 73, 0.1) 77.55%)" }}></div>
        </section>
    )
}
