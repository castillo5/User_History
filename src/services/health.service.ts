import healthDAO from '../dao/health.dao';
import { HealthCheckResponseDTO } from '../dto/health.dto';

class HealthService {
  getServiceStatus(): HealthCheckResponseDTO {
    return healthDAO.getServerStatus();
  }
}

export default new HealthService();
