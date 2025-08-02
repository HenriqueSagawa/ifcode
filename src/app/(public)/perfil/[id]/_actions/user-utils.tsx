import { format, parseISO } from 'date-fns';

export const formatBirthDate = (dateString: string | undefined | null): string => {
    // Se a data não for informada, retorna o padrão
    if (!dateString) {
        return "Não informado";
    }

    try {
        const date = parseISO(dateString);
        return format(date, 'dd/MM/yyyy');
    } catch (error) {
        console.error("Erro ao formatar a data:", error);
        return "Data inválida";
    }
}

export const formatPhoneNumber = (phoneNumber: string | undefined | null): string => {
    if (!phoneNumber) {
        return "Não informado";
    }

    const cleaned = phoneNumber.replace(/\D/g, '');
  
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  
    return cleaned;
  };