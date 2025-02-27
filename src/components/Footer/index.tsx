/**
 * Componente que renderiza o rodapé (footer) da aplicação.
 *
 * Este componente exibe uma mensagem de copyright e informa que foi desenvolvido
 * com café pela equipe do IF Code.
 *
 * @returns {JSX.Element} O rodapé renderizado.
 */
export function Footer() {
  return (
    <footer className="flex-grow flex justify-center items-center text-gray-600 w-full h-24">
      <aside>
        <p>Copyright © {new Date().getFullYear()} - Desenvolvido com muito café pela equipe do IF Code</p>
      </aside>
    </footer>
  )
}
