import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { HealthService } from './health.service';

@Controller('health')
@ApiUseTags('health')
export class HealthController {
  constructor(
    private readonly health: HealthService,
  ) { }

  @Get()
  @ApiOperation({ title: 'Health check' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 500, description: 'node is not healthy' })
  async check(@Req() req: Request, @Res() res: Response): Promise<Response> {
    if (!await this.health.isNodeHealthy()) {
      return res.status(500).send('node is not healthy');
    }

    return res.status(200).send();
  }
}
