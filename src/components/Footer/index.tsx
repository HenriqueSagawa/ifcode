export function Footer() {
  return (
    <footer className="flex-grow flex justify-center items-center z-50 text-sm text-gray-600 w-full text-center">
      <aside>
        <p>Copyright © {new Date().getFullYear()} - Desenvolvido com muito café pela equipe do IF Code</p>
      </aside>
    </footer>
  )
}