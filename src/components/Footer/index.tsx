export function Footer() {
  return (
    <footer className="flex-grow flex justify-center items-center py-2 z-50 fixed bottom-0 text-sm dark:text-white text-gray-600 w-full text-center">
      <aside>
        <p>Copyright © {new Date().getFullYear()} - Desenvolvido com muito café pela equipe do IF Code</p>
      </aside>
    </footer>
  )
}