export const suffleArray = (array :any[]) => 
    [...array].sort(() => Math.random() - 0.5)