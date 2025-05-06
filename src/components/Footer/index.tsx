import React from "react"; // Importa React (embora não estritamente necessário para este componente simples sem JSX complexo ou hooks)

/**
 * Componente que renderiza o rodapé padrão do site.
 * Exibe uma mensagem de copyright com o ano atual dinâmico e créditos.
 * Utiliza classes Tailwind CSS para estilização e posicionamento.
 *
 * @component
 * @returns {JSX.Element} O elemento JSX que representa o rodapé da página.
 */
export function Footer() {
  return (
    // Elemento semântico <footer> para o rodapé.
    // Estilização Tailwind:
    // - flex-grow: Permite que o footer cresça se houver espaço extra (útil em layouts flex column).
    // - flex justify-center items-center: Centraliza o conteúdo horizontal e verticalmente.
    // - z-50: Define uma alta ordem de empilhamento (stacking order), caso necessário.
    // - text-sm text-gray-600: Define tamanho e cor do texto.
    // - w-full text-center: Garante largura total e alinhamento central do texto.
    <footer className="flex-grow flex justify-center items-center z-50 text-sm text-gray-600 dark:text-gray-400 w-full text-center py-4 border-t dark:border-gray-800 mt-8"> {/* Adicionado padding, border e margin */}
      {/* O elemento <aside> é frequentemente usado para conteúdo tangencialmente relacionado,
          mas aqui poderia ser simplesmente um <p> ou <div>. Mantido conforme o código original. */}
      <aside>
        {/* Parágrafo contendo o texto do copyright. */}
        <p>
          Copyright © {new Date().getFullYear()} - Desenvolvido com muito café pela equipe do IF Code {/* Obtém o ano atual dinamicamente */}
        </p>
      </aside>
    </footer>
  )
}