
export class LatenciaUtil {     // Simula un delay aleatorio entre 500ms y 1500ms
  
static async simular(): Promise<void> {
    const delay = Math.floor(Math.random() * 1000) + 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
