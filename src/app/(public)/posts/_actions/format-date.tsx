export function parsePortugueseDate(dateString: string): Date | null {
    try {
      if (dateString.includes("de") && dateString.includes("às")) {
        // Separar data e hora
        const [datePart, timeWithTz] = dateString.split(" às ")
        
        const dateComponents = datePart.trim().split(" ")
        if (dateComponents.length < 4) return null
        
        const day = parseInt(dateComponents[0])
        const month = dateComponents[2].toLowerCase()
        const year = parseInt(dateComponents[3]) 
        
        const monthMap: { [key: string]: number } = {
          "janeiro": 0, "fevereiro": 1, "março": 2,
          "abril": 3, "maio": 4, "junho": 5,
          "julho": 6, "agosto": 7, "setembro": 8,
          "outubro": 9, "novembro": 10, "dezembro": 11
        }
        
        const monthNumber = monthMap[month]
        if (monthNumber === undefined) return null

        let hour = 0, minute = 0, second = 0
        if (timeWithTz) {
          const timeOnly = timeWithTz.split(" ")[0] 
          const timeComponents = timeOnly.split(":")
          hour = parseInt(timeComponents[0]) || 0
          minute = parseInt(timeComponents[1]) || 0
          second = parseInt(timeComponents[2]) || 0
        }
        
        const date = new Date(year, monthNumber, day, hour, minute, second)
        
        if (isNaN(date.getTime())) return null
        
        return date
      }
      
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? null : date
      
    } catch (error) {
      console.error("Erro ao fazer parsing da data:", error)
      return null
    }
  }
  
  export function formatDate(dateString: string, locale: string = "pt-BR"): string {
    const date = parsePortugueseDate(dateString)
    
    if (!date) {
      return "Data inválida"
    }
    
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }
  
  export function formatDateTime(dateString: string, locale: string = "pt-BR"): string {
    const date = parsePortugueseDate(dateString)
    
    if (!date) {
      return "Data inválida"
    }
    
    return date.toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  
  export function getRelativeTime(dateString: string): string {
    const date = parsePortugueseDate(dateString)
    
    if (!date) {
      return "Data inválida"
    }
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return "Agora mesmo"
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}h atrás`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} dias atrás`
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return `${diffInWeeks} semanas atrás`
    }
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} meses atrás`
    }
    
    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears} anos atrás`
  }