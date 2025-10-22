import { HealthCheckResponseDTO } from '../dto/health.dto';

class HealthDAO {
  getServerStatus(): HealthCheckResponseDTO {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

export default new HealthDAO();
