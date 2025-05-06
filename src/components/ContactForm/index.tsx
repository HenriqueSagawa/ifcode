// Diretiva do Next.js para Client Component, necessária para useState e interações do formulário.
"use client"

import React from "react"; // Importa React
import { Button } from "../ui/button"; // Importa componente Button (presumivelmente Shadcn UI)
import { useState } from "react"; // Importa hook useState do React
import emailjs from "@emailjs/browser"; // Importa a biblioteca EmailJS para envio de email pelo frontend
import { SuccessMessage } from "../ui/success-message"; // Importa um componente customizado para exibir mensagem de sucesso

/**
 * Componente que renderiza a seção de contato completa, incluindo:
 * - Informações estáticas (endereço, telefone, email).
 * - Um formulário de contato (nome, email, telefone, mensagem).
 * - Lógica para enviar os dados do formulário usando EmailJS.
 * - Exibição de status (sucesso/erro) e uma mensagem modal de sucesso.
 * Utiliza os sub-componentes ContactInputBox e ContactTextArea para os campos do formulário.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que representa toda a seção de contato.
 */
export const ContactForm = () => {
    // Estado para armazenar os dados inseridos nos campos do formulário.
    const [formData, setFormdata] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    // Estado para armazenar a mensagem de status (sucesso/erro) a ser exibida após o envio.
    const [status, setStatus] = useState("");
    // Estado para controlar a visibilidade do modal/componente de mensagem de sucesso.
    const [showSuccess, setShowSuccess] = useState(false);

    /**
     * Manipulador genérico para atualizações nos campos de input e textarea.
     * Atualiza o estado `formData` com o novo valor do campo modificado.
     * Usa o atributo 'name' do campo para identificar qual propriedade do estado atualizar.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - O evento de mudança.
     */
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormdata({ ...formData, [e.target.name]: e.target.value });
    }

    /**
     * Manipulador para o evento de submit do formulário.
     * Previne o comportamento padrão do formulário.
     * Tenta enviar os dados do estado `formData` usando EmailJS.
     * Atualiza o estado `status` e `showSuccess` com base no resultado.
     * Limpa o formulário em caso de sucesso.
     *
     * @async
     * @param {React.FormEvent} e - O evento de submit do formulário.
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Previne o recarregamento da página

        try {
            // Envia o email usando EmailJS.
            // NOTA: Expor Service ID, Template ID e User ID (Public Key) no frontend
            // é uma prática comum com EmailJS, mas esteja ciente das implicações.
            const response = await emailjs.send(
                "service_f2bi4pl", // Substitua pelo seu Service ID real do EmailJS
                "template_p62l33e", // Substitua pelo seu Template ID real do EmailJS
                formData, // Os dados do formulário a serem enviados
                "7ZehpHGHmuYj1a0Wn", // Substitua pela sua Public Key real do EmailJS
            );
            console.log("Email enviado:", response); // Log de sucesso (opcional)
            setStatus("Email enviado com sucesso"); // Define mensagem de status
            setFormdata({ name: "", email: "", phone: "", message: "" }); // Limpa os campos do formulário
            setShowSuccess(true); // Mostra o modal/mensagem de sucesso
        } catch (err) {
            console.error("Erro ao enviar o email:", err); // Log de erro
            setStatus("Erro ao enviar o email"); // Define mensagem de status de erro
        }
    }

    // Renderização do JSX
    return (
        // Usa Fragment (<>) para agrupar a seção e a mensagem de sucesso sem adicionar nó extra no DOM.
        <>
            {/* Seção principal da página de contato */}
            <section className="relative overflow-hidden py-20 lg:py-[120px]">
                {/* Container para centralizar o conteúdo */}
                <div className="container mx-auto">
                    {/* Layout de grid/flex para duas colunas em telas maiores */}
                    <div className="-mx-4 flex flex-wrap lg:justify-between">

                        {/* Coluna Esquerda: Informações de Contato Estáticas */}
                        <div className="w-full px-4 lg:w-1/2 xl:w-6/12">
                            <div className="mb-12 max-w-[570px] lg:mb-0">
                                <span className="mb-4 block text-base font-semibold text-primary">
                                    Entre em Contato
                                </span>
                                <h2 className="mb-6 text-[32px] font-bold uppercase text-dark dark:text-white sm:text-[40px] lg:text-[36px] xl:text-[40px]">
                                    FALE CONOSCO
                                </h2>
                                <p className="mb-9 text-base leading-relaxed text-body-color dark:text-dark-6">
                                    Estamos aqui para ajudar! Se você tiver alguma dúvida, sugestão ou precisar de suporte, não hesite em entrar em contato conosco. Nossa equipe está pronta para atendê-lo da melhor forma possível.
                                </p>
                                {/* Bloco de Endereço */}
                                <div className="mb-8 flex w-full max-w-[370px]">
                                    {/* Ícone */}
                                    <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                                        {/* SVG do ícone de localização/casa */}
                                        <svg /* ... */> {/* ... */}</svg>
                                    </div>
                                    {/* Texto */}
                                    <div className="w-full">
                                        <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                                            Nosso Endereço
                                        </h4>
                                        <p className="text-base text-body-color dark:text-dark-6">
                                            Av. Cívica, 475 - Assis Chateaubriand, PR, 85935-000
                                        </p>
                                    </div>
                                </div>
                                {/* Bloco de Telefone */}
                                <div className="mb-8 flex w-full max-w-[370px]">
                                    {/* Ícone */}
                                    <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                                         {/* SVG do ícone de telefone */}
                                        <svg /* ... */> {/* ... */}</svg>
                                    </div>
                                    {/* Texto */}
                                    <div className="w-full">
                                        <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                                            Telefone
                                        </h4>
                                        <p className="text-base text-body-color dark:text-dark-6">
                                            Indispoível no momento...
                                        </p>
                                    </div>
                                </div>
                                {/* Bloco de Email */}
                                <div className="mb-8 flex w-full max-w-[370px]">
                                    {/* Ícone */}
                                    <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                                         {/* SVG do ícone de email/envelope */}
                                        <svg /* ... */> {/* ... */}</svg>
                                    </div>
                                    {/* Texto */}
                                    <div className="w-full">
                                        <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                                            Email
                                        </h4>
                                        <p className="text-base text-body-color dark:text-dark-6">
                                            ifcodeprojeto@gmail.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coluna Direita: Formulário de Contato */}
                        <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
                            {/* Card/Container do formulário */}
                            <div className="relative rounded-lg p-8 shadow-lg bg-[#F0F0F0] dark:bg-black sm:p-12">
                                {/* Formulário com manipulador onSubmit */}
                                <form onSubmit={handleSubmit}>
                                    {/* Campos do formulário usando sub-componentes */}
                                    <ContactInputBox
                                        type="text"
                                        name="name" // Deve corresponder à chave em `formData`
                                        placeholder="Seu Nome"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <ContactInputBox
                                        type="email" // Mudado para type="email" para validação básica do navegador
                                        name="email"
                                        placeholder="Seu Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <ContactInputBox
                                        type="tel" // Mudado para type="tel"
                                        name="phone"
                                        placeholder="Seu Telefone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <ContactTextArea
                                        row={6} // Número de linhas visíveis
                                        placeholder="Sua Mensagem"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                    {/* Botão de envio */}
                                    <div>
                                        <Button
                                            variant="ghost" // Pode ajustar a variante conforme o design system
                                            type="submit"
                                            className="w-full rounded border border-primary bg-primary p-3 dark:text-white transition hover:bg-opacity-90"
                                        >
                                            Enviar Mensagem
                                        </Button>
                                    </div>
                                </form>
                                {/* Exibição da mensagem de status (opcional, pode ser removida se usar apenas o modal) */}
                                {status && <p className="mt-4 text-center text-sm font-medium">{status}</p>}

                                {/* Elementos SVG decorativos posicionados absolutamente */}
                                <div>
                                    <span className="absolute -right-9 -top-10 z-[-1]">
                                         {/* SVG decorativo 1 */}
                                        <svg /* ... */> {/* ... */}</svg>
                                    </span>
                                    <span className="absolute -right-10 top-[90px] z-[-1]">
                                         {/* SVG decorativo 2 */}
                                        <svg /* ... */> {/* ... */}</svg>
                                    </span>
                                    <span className="absolute -bottom-7 -left-7 z-[-1]">
                                        {/* SVG decorativo 3 */}
                                        <svg /* ... */> {/* ... */}</svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Componente Modal/Toast para Mensagem de Sucesso */}
            <SuccessMessage
                isOpen={showSuccess} // Controla a visibilidade
                onClose={() => setShowSuccess(false)} // Função para fechar
                message="Sua mensagem foi enviada com sucesso! Entraremos em contato em breve." // Mensagem exibida
            />
        </>
    );
};

// --- Sub-componentes para os campos do formulário ---

/**
 * Sub-componente reutilizável para campos de <textarea> no formulário de contato.
 *
 * @component
 * @param {object} props - Propriedades do componente.
 * @param {number | string} props.row - Número de linhas visíveis para o textarea.
 * @param {string} props.placeholder - Texto de placeholder do textarea.
 * @param {string} props.name - Nome do campo (usado para o estado e submit).
 * @param {string} props.value - Valor atual do campo (controlado pelo estado).
 * @param {(e: React.ChangeEvent<HTMLTextAreaElement>) => void} props.onChange - Função chamada quando o valor muda.
 * @returns {JSX.Element} O elemento JSX do campo textarea.
 */
const ContactTextArea = ({ row, placeholder, name, value, onChange }: any) => {
    // NOTA: Usar 'any' para props não é ideal em TypeScript. Definir uma interface seria melhor.
    return (
        <>
            <div className="mb-6">
                <textarea
                    rows={row}
                    placeholder={placeholder}
                    name={name}
                    className="w-full resize-none rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6" // Estilização Tailwind
                    value={value}
                    onChange={onChange}
                    required // Adicionado required para validação básica
                />
            </div>
        </>
    );
};

/**
 * Sub-componente reutilizável para campos de <input> no formulário de contato.
 *
 * @component
 * @param {object} props - Propriedades do componente.
 * @param {string} props.type - Tipo do input (text, email, tel).
 * @param {string} props.placeholder - Texto de placeholder do input.
 * @param {string} props.name - Nome do campo (usado para o estado e submit).
 * @param {string} props.value - Valor atual do campo (controlado pelo estado).
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Função chamada quando o valor muda.
 * @returns {JSX.Element} O elemento JSX do campo input.
 */
const ContactInputBox = ({ type, placeholder, name, value, onChange }: any) => {
    // NOTA: Usar 'any' para props não é ideal em TypeScript. Definir uma interface seria melhor.
    return (
        <>
            <div className="mb-6">
                <input
                    type={type}
                    required // Adicionado required para validação básica
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    name={name}
                    className="w-full rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6" // Estilização Tailwind
                />
            </div>
        </>
    );
};