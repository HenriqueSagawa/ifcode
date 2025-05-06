import React from 'react'; // Importa React (necessário para JSX e tipos como React.ReactNode implicitamente)

/**
 * Props para o componente HeartIcon.
 * Embora o tipo `any` seja usado no código original, uma interface mais específica seria:
 * interface HeartIconProps extends React.SVGProps<SVGSVGElement> {
 *   size?: number | string;
 *   // Props específicos filtrados (opcional incluir aqui para clareza)
 *   isSelected?: boolean;
 *   isIndeterminate?: boolean;
 *   disableAnimation?: boolean;
 * }
 */

/**
 * Componente que renderiza um ícone SVG de coração.
 * Permite customização de tamanho via props `size`, `height`, ou `width`.
 * A cor do ícone é definida pela propriedade `color` do CSS do elemento pai,
 * graças ao atributo `fill="currentColor"` no path SVG.
 *
 * Ele filtra props específicas (`isSelected`, `isIndeterminate`, `disableAnimation`)
 * para evitar passá-las como atributos inválidos para o elemento SVG, enquanto
 * repassa todas as outras props (como `className`, `style`, `aria-label`, etc.)
 * para o elemento SVG raiz.
 *
 * @component
 * @param {object} props - Propriedades do componente.
 * @param {number | string} [props.size] - Define a largura e a altura do ícone. Tem precedência sobre `width` e `height`. Default: 24.
 * @param {number | string} [props.height] - Define a altura do ícone. Usado se `size` não for fornecido. Default: 24.
 * @param {number | string} [props.width] - Define a largura do ícone. Usado se `size` não for fornecido. Default: 24.
 * @param {any} [props...] - Outras props (incluindo atributos SVG padrão como `className`, `style`, `onClick`, `aria-label`, etc.) serão passadas diretamente para o elemento SVG raiz. Props como `isSelected`, `isIndeterminate`, `disableAnimation` são filtradas.
 * @returns {JSX.Element} O elemento JSX representando o ícone SVG de coração.
 */
export const HeartIcon = ({ size, height, width, ...props }: any) => { // Nota: 'any' é usado aqui como no original, mas uma interface tipada é preferível.
    // Filtra props específicas que não devem ser passadas para o elemento SVG DOM.
    // Essas props podem ser usadas por componentes pais (ex: um Checkbox customizado), mas são inválidas no SVG.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isSelected, isIndeterminate, disableAnimation, ...otherProps } = props;

    return (
      // Elemento SVG raiz.
      <svg
        // `fill="fill"` aqui pode ser redundante se o path usa `currentColor`.
        // Pode ser removido ou mantido dependendo do contexto/compatibilidade.
        fill="fill"
        // Define a altura: prioriza `size`, depois `height`, e por último o default 24.
        height={size || height || 24}
        // Define o sistema de coordenadas interno do SVG.
        viewBox="0 0 24 24"
        // Define a largura: prioriza `size`, depois `width`, e por último o default 24.
        width={size || width || 24}
        // Namespace XML padrão para SVG.
        xmlns="http://www.w3.org/2000/svg"
        // Espalha todas as outras props recebidas (className, style, onClick, etc.) no elemento SVG.
        {...otherProps}
      >
        {/* O caminho (path) que desenha a forma do coração. */}
        <path
          d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
          // `fill="currentColor"` faz o ícone herdar a cor do texto do elemento pai.
          // Isso permite fácil estilização usando classes de cor de texto (ex: text-red-500).
          fill="currentColor"
        />
      </svg>
    );
  };